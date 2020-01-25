import * as os from 'os';
import { excludeBlacklist } from '../utils/excludeBlacklist';
import { blackListPattern } from '../utils/branchPattern';

const myBranchPattern = `${os.userInfo().username}_`;

// test excludeBlacklist
const branchNameTestList = [
  { name: 'toto', shouldBeExcluded: false },
  { name: 'remotes/origin/master', shouldBeExcluded: true },
  { name: 'remotes/origin/master_tt', shouldBeExcluded: true },
  { name: 'remotes/origin/release', shouldBeExcluded: true },
  { name: 'remotes/origin/release_tt', shouldBeExcluded: true },
  { name: 'remotes/origin/Release_t_t', shouldBeExcluded: true },
  { name: 'release', shouldBeExcluded: true },
  { name: 'Release', shouldBeExcluded: true },
  { name: 'master', shouldBeExcluded: true },
  { name: `remotes/origin/${myBranchPattern}t`, shouldBeExcluded: false },
  { name: `${myBranchPattern}t`, shouldBeExcluded: false },
];

test('branch to be excluded/included correctly', () => {
  branchNameTestList.map(test => {
    expect(excludeBlacklist(test.name, blackListPattern)).toEqual(
      test.shouldBeExcluded,
    );
  });
});
