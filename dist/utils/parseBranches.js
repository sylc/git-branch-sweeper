"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detachedRegex = /^(\*?\s+)\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/;
var branchRegex = /^(\*?\s+)(\S+)\s+([a-z0-9]+)\s(.*)$/;
function parseBranches(output) {
    var all = [];
    var branches = [];
    var current = '';
    var detached = true;
    output.split('\n').forEach(function (line) {
        var branch = detachedRegex.exec(line);
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
    var branchSummary = {
        current: current,
        detached: detached,
        all: all,
        branches: branches,
    };
    return branchSummary;
}
exports.parseBranches = parseBranches;
//# sourceMappingURL=parseBranches.js.map