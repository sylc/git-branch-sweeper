# Git-Branch-Sweeper

Node CLI to easily bulk delete local and remote branches.

## Installation

```
$ npm install --global git-branch-sweeper
```

This will install the Git-Branch-Sweeper package globally and allow the CLI tool to be run from any location.

## Usage

From inside a gihub repo run `git-branch-sweeper` or `gbs`

You will be prompted with the list of Branches that can be deleted, i.e:

- For the local repo: All branches, except branches **starting** with names `master` and `release`
- For the remote: All branches with names containing your branch pattern\*\*, by default your username, except branches **starting** with names `master` and `release`

\*\* You can configure the branch pattern by providing a .gbsrc file in your HOME directory as follow:

```json
{
  "myBranchPattern": "my-cool-name"
}
```

## Git command that tool execute under the hood

To list the branches

```
$ git fetch --prune
for local branches: git branch -v --merged/--no-merged
for remote branches: git branch -v -r
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

- This tool only support the remote being `origin`.

## Develop

`npm run dev`

### Build

To build the project, in VS Code, run the default build task (which is tsc watch)
or run `npm run build`

### Test

- Run the automated test with `npm run test`
- Once built, call `node ./dist/index.js` to call the commandline locally

## TODOs

- configurable branch pattern whitelist and blacklist
- show stale branch information (stale from x days)
- verbose mode (git command that are executed)
