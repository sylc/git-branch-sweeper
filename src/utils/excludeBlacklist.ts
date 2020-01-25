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
