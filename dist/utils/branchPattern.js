"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
exports.myBranchPattern = os.userInfo().username + "_";
// name of branches to be always excluded from listing.
// if release is specified, all branches like release**** will be excluded.
exports.blackListPattern = ['master', 'release'];
//# sourceMappingURL=branchPattern.js.map