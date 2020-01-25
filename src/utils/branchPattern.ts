import * as os from 'os';

export const myBranchPattern = `${os.userInfo().username}_`;

// name of branches to be always excluded from listing.
// if release is specified, all branches like release**** will be excluded.
export const blackListPattern = ['master', 'release'];
