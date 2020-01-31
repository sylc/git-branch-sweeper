"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var path = require("path");
var fs = require("fs");
var defaults = {
    myBranchPattern: os.userInfo().username + "_",
};
var userConfig = {};
try {
    var filePath = "" + path.join(os.homedir(), '.gbsrc');
    if (fs.existsSync(filePath)) {
        userConfig = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
    }
}
catch (err) {
    throw Error('failed to read user config');
}
var config = __assign({}, defaults, userConfig);
exports.myBranchPattern = config.myBranchPattern;
// name of branches to be always excluded from listing.
// if release is specified, all branches like release**** will be excluded.
exports.blackListPattern = ['master', 'release'];
//# sourceMappingURL=branchPattern.js.map