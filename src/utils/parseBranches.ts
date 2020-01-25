interface Branch {
  current: boolean;
  name: string;
  commit: string;
  label: string;
}

interface BranchesSummary {
  detached: boolean;
  current: string;
  all: string[];
  branches: Branch[];
}

const detachedRegex = /^(\*?\s+)\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/;
const branchRegex = /^(\*?\s+)(\S+)\s+([a-z0-9]+)\s(.*)$/;

export function parseBranches(output: string): BranchesSummary {
  const all: string[] = [];
  const branches: Branch[] = [];
  let current = '';
  let detached = true;

  output.split('\n').forEach((line: string) => {
    let branch = detachedRegex.exec(line);
    if (!branch) {
      detached = false;
      branch = branchRegex.exec(line);
    }

    if (branch) {
      all.push(branch[2]);
      if (branch[1].charAt(0) === '*') {
        current = branch[2];
      }
      branches.push({
        current: branch[1].charAt(0) === '*',
        name: branch[2],
        commit: branch[3],
        label: branch[4],
      });
    }
  });

  const branchSummary: BranchesSummary = {
    current,
    detached,
    all,
    branches,
  };

  return branchSummary;
}
