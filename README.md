# Git-Branch-Sweeper

Node CLI to easily bulk delete local and remote branches.

## Installation

Run the following command

```
npm i -g  https://github.com/sylc/git-branch-sweeper.git
```

This will install the Git-Branch-Sweeper package globally and allow the CLI tool to be run from any location.

## Usage

From inside a gihub repo run `git-branch-sweeper` or `gbs`

You will be prompted with the list of Branches that can be deleted, i.e:

- For the local repo: All branches that have been _**merged**_, except branches **starting** with names `master` and `release`
- For the remote: All branches that have been _**merged**_ with names containing your username except branches **starting** with names `master` and `release`

## Summary Of what the tool do

$ git push origin --delete <branch_name>
$ git branch -d <branch_name>
If there are unmerged changes which you are confident of deleting:

\$ git branch -D <branch_name>
Delete Local Branch

To delete the local branch use:

\$ git branch -d branch_name
Note: The -d option is an alias for --delete, which only deletes the branch if
it has already been fully merged in its upstream branch.
You could also use -D, which is an alias for --delete --force, which deletes
the branch "irrespective of its merged status." [Source: man git-branch]
\*/

## Notes

- Branches that have been merged with GitHub `Squash and merged` on the remote are not _merged_ for git.
- This tool only support the remote being `origin`.

## Develop

### Build

To build the project, in VS Code, run the default build task (which is tsc watch)
or run `npm run build`

### Test

run `npm run test`

## TODOs

- publish to npm
- configurable branch pattern whitelist and blacklist
- show stale branch
- verbose mode
