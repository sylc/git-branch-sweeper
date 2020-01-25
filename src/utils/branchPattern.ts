import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

// try to find a global config file .gbsrc in home folder
interface Config {
  myBranchPattern: string;
}

const defaults: Config = {
  myBranchPattern: `${os.userInfo().username}_`,
};

let userConfig: Partial<Config> = {};

try {
  const filePath = `${path.join(os.homedir(), '.gbsrc')}`;
  userConfig = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
} catch (err) {
  // do nothing;
}

const config = { ...defaults, ...userConfig };

export const myBranchPattern = config.myBranchPattern;

// name of branches to be always excluded from listing.
// if release is specified, all branches like release**** will be excluded.
export const blackListPattern = ['master', 'release'];
