"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function excludeBlacklist(branchName, blackList) {
    // ensure that branch name is not part of blacklist
    var toExclude = false;
    blackList.map(function (blacklistPattern) {
        var reg1 = RegExp("/" + blacklistPattern, 'i'); // will match 'remotes/origin/<pattern>'
        var reg2 = RegExp("^" + blacklistPattern, 'i'); // will match '<pattern>'
        if (branchName.search(reg1) > -1 || branchName.search(reg2) > -1) {
            toExclude = true;
        }
    });
    return toExclude;
}
exports.excludeBlacklist = excludeBlacklist;
//# sourceMappingURL=excludeBlacklist.js.map