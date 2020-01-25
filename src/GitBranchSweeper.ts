import * as os from 'os';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

import * as utils from './utils/branch';

enum RepoType {
  Remote = 'remote',
  Local = 'local',
}

const git = require('cmd-executor').git;

const myBranchPattern = `${os.userInfo().username}_`;
console.log(`looking for pattern ${myBranchPattern}`);
// name of branches to be always excluded from listing.
// if release is specified, all branches like release**** will be excluded.
export const blackList = ['master', 'release'];

export function excludeBlacklist(
  branchName: string,
  blackList: string[],
): boolean {
  // ensure that branch name is not part of blacklist
  let toExclude = false;
  blackList.map(blacklistPattern => {
    const reg1 = RegExp(`\/${blacklistPattern}`, 'i'); // will match 'remotes/origin/<pattern>'
    const reg2 = RegExp(`^${blacklistPattern}`, 'i'); // will match '<pattern>'
    if (branchName.search(reg1) > -1 || branchName.search(reg2) > -1) {
      toExclude = true;
    }
  });

  return toExclude;
}

/**
 * Retrieve branches list
 * @param opts git branch options eg: -v --merged
 * @param remote if we are looking for remote or local branches
 */
async function gitListBranches(opts: string, remote = false) {
  let myBranchSelection = '';
  if (remote) myBranchSelection = `remotes/origin/${myBranchPattern}`;

  try {
    if (remote) {
      console.log(
        chalk.green(`Retrieving branches with pattern: ${myBranchSelection}`),
      );
    }

    await git.fetch('--prune');
    const rawBranches = await git.branch(opts);

    const branchSummary = utils.parseBranches(rawBranches);
    const branchList = branchSummary.all;

    // filter branches to pattern
    const myBranches = branchList.filter(branchName => {
      // on the local repo, myBranchSelection will be '' : i.e: all branches will be listed
      // on the remote, myBranchSelection will be 'remotes/origin/' + username;

      // cannot delete current branch
      if (branchName === branchSummary.current) {
        return false;
      }

      // ensure branch is not part of the blackList array.
      if (excludeBlacklist(branchName, blackList)) {
        return false;
      }

      // search for my branch pattern
      if (branchName.indexOf(myBranchSelection) > -1) {
        return true;
      }

      // default
      return false;
    });

    if (myBranches.includes(branchSummary.current)) {
      console.log(chalk.yellow(`cannot delete ${branchSummary.current}`));
    }
    return myBranches;
  } catch (err) {
    console.log('Error listing Branches', err);
    throw err;
  }
}

async function deleteRemoteMergedBranches(myBranches: string[]) {
  console.log(chalk.green('Deleting remote branches:'));

  for (const branch of myBranches) {
    let br;
    if (branch.indexOf('remotes/origin/') === 0) {
      br = branch.substr('remotes/origin/'.length);
    } else {
      br = branch;
    }

    // delete branches remotely
    await git.push(`origin --delete ${br}`);
    console.log(chalk.red(`* deleted: ${branch}`));
  }
}

async function deleteLocalMergedBranch(branchName: string) {
  // delete branch locally
  try {
    await git.branch(`-d ${branchName}`);
    console.log(chalk.blue(`* deleted: ${branchName}`));
  } catch (err) {
    console.log(chalk.blue(`* Failed deleted: ${branchName} with error: `));
    console.log(err);
    const agree = (await inquirer.prompt([
      {
        type: 'confirm',
        name: 'agree',
        message: 'Force deletion',
        default: true,
      },
    ])) as { agree: string };
    if (agree) {
      await git.branch(`-D ${branchName}`);
      console.log(chalk.blue(`* deleted: ${branchName}`));
    } else {
      console.log(`* skipped: ${branchName}`);
    }
  }
}

async function deleteLocalUnMergedBranch(branchName: string) {
  // delete branch locally
  const agree = (await inquirer.prompt([
    {
      type: 'confirm',
      name: 'agree',
      message: 'This branch is not merged. Confirm Delete',
      default: true,
    },
  ])) as { agree: string };
  if (agree) {
    await git.branch(`-D ${branchName}`);
    console.log(chalk.red(`* deleted: ${branchName}`));
  } else {
    console.log(`* skipped: ${branchName}`);
  }
}

export async function prompt() {
  try {
    const repoType = (await inquirer.prompt([
      {
        type: 'list',
        name: 'repo',
        message: 'Where would you like to delete your branches',
        choices: [RepoType.Local, RepoType.Remote],
        filter: (val: any) => {
          return val.toLowerCase();
        },
      },
    ])) as { repo: string };

    switch (repoType.repo) {
      case RepoType.Local:
        console.log(chalk.green('Retrieving Local branches...'));
        // list my local branches MERGED
        const localMergedBranches = await gitListBranches('-v --merged', false);

        // list my local branches NOT MERGED
        const localNoMergedBranches = await gitListBranches(
          '-v --no-merged',
          false,
        );

        const allMyLocalBranches: Array<string> = [];
        allMyLocalBranches.push(new inquirer.Separator(' = Merged Branches ='));
        allMyLocalBranches.push(...localMergedBranches);
        allMyLocalBranches.push(
          new inquirer.Separator(' = Un-Merged Branches ='),
        );
        allMyLocalBranches.push(...localNoMergedBranches);

        // inquiry to choose branches to delete.
        const myChoiceOfLocalBranches = (await inquirer.prompt({
          type: 'checkbox',
          name: 'branches',
          message: 'Which branches would you like to delete',
          choices: allMyLocalBranches,
          pageSize: 20,
        })) as { branches: string[] };

        console.log(chalk.green('Deleting local Branches:'));
        for (const branch of myChoiceOfLocalBranches.branches) {
          if (localMergedBranches.includes(branch)) {
            await deleteLocalMergedBranch(branch);
          } else {
            await deleteLocalUnMergedBranch(branch);
          }
        }
        break;

      case RepoType.Remote:
        // list my remote branches
        const allMyRemoteBranches: string[] = await gitListBranches(
          '-v -a --merged',
          true,
        );
        allMyRemoteBranches.push(new inquirer.Separator());

        // inquiry to choose branches to delete.
        const myChoiceOfRemoteBranches = (await inquirer.prompt({
          type: 'checkbox',
          name: 'branches',
          message: 'Which branches would you like to delete',
          choices: allMyRemoteBranches,
          pageSize: 20,
        })) as { branches: string[] };

        await deleteRemoteMergedBranches(myChoiceOfRemoteBranches.branches);
        break;

      default:
        console.log('choice not valid');
        break;
    }

    console.log(chalk.green('Done!'));
  } catch (err) {
    console.log(err);
  }
}
