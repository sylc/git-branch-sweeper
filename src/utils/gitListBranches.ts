import chalk from 'chalk';
import { myBranchPattern, blackListPattern } from './branchPattern';
import { parseBranches } from './parseBranches';
import { excludeBlacklist } from './excludeBlacklist';

const git = require('cmd-executor').git;

/**
 * Retrieve branches list
 * @param opts git branch options eg: -v --merged
 * @param remote if we are looking for remote or local branches
 */
export async function gitListBranches(opts: string, remote = false) {
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

    const branchSummary = parseBranches(rawBranches);
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
      if (excludeBlacklist(branchName, blackListPattern)) {
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
