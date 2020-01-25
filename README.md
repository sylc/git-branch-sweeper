# Git-Branch-Sweeper

Node Cli to easily bulk delete local and remote branches. 

## Installation

Run the following command
```
npm i -g  https://github.com/sylc/git-branch-sweeper.git
```
This will install the Git-Branch-Sweeper package globally and allow the CLI tool to be run from any location.

## Usage

From inside a gihub repo run `git-branch-sweeper` or `gbs`

You will be prompted with the list of Branches that can be deleted, i.e:
+ For the local repo: All branches that have been _**merged**_, except branches **starting** with names `master` and `release`
+ For the remote: All branches that have been _**merged**_ with names containing your username except branches **starting** with names `master` and `release`

## Notes

+ Branches that have been merged with GitHub `Squash and merged` on the remote are not _merged_ for git.
+ This tool only support the remote being `origin`.

## Develop

To build the project, in VS Code, run the default build task (which is tsc watch)
or run `npm run build`
