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
- For the remote: All branches that have been _**merged**_ with names containing your username\* except branches **starting** with names `master` and `release`

* you can configure the branch pattern by providing a .gbsrc file in your HOME directory as follow:

```json
{
  "myBracnhPattern": "my-cool-name"
}
```

## Summary Of what the tool do

To list the branches

```
$ git fetch --prune
for local branches: git branch -v --merged/--no-merged
for remote branches: git branch -a -v --merged/--no-merged
```

When you choose to delete a branch

```
$ git push origin --delete <branch_name>
// for merged:
$ git branch -d <branch_name>
// Or for unmerged:
$ git branch -D <branch_name>
```

## Notes

- Branches that have been merged with GitHub `Squash and merged` on the remote are not _merged_ for git.
- This tool only support the remote being `origin`.

## Develop

### Build

To build the project, in VS Code, run the default build task (which is tsc watch)
or run `npm run build`

### Test

- Run the automated test `npm run test`
- Once built, call node `./dist/index.js`

## TODOs

- publish to npm and remove dist folder from git
- configurable branch pattern whitelist and blacklist
- show stale branch information (stale from x days)
- verbose mode (git command that are executed)
