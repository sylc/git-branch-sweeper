"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var inquirer = require("inquirer");
var chalk_1 = require("chalk");
var utils = require("./utils/branch");
var RepoType;
(function (RepoType) {
    RepoType["Remote"] = "remote";
    RepoType["Local"] = "local";
})(RepoType || (RepoType = {}));
var git = require('cmd-executor').git;
var myBranchPattern = os.userInfo().username + "_";
console.log("looking for pattern " + myBranchPattern);
// name of branches to be always excluded from listing.
// if release is specified, all branches like release**** will be excluded.
exports.blackList = ['master', 'release'];
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
/**
 * Retrieve branches list
 * @param opts git branch options eg: -v --merged
 * @param remote if we are looking for remote or local branches
 */
function gitListBranches(opts, remote) {
    if (remote === void 0) { remote = false; }
    return __awaiter(this, void 0, void 0, function () {
        var myBranchSelection, rawBranches, branchSummary_1, branchList, myBranches, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myBranchSelection = '';
                    if (remote)
                        myBranchSelection = "remotes/origin/" + myBranchPattern;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (remote) {
                        console.log(chalk_1.default.green("Retrieving branches with pattern: " + myBranchSelection));
                    }
                    return [4 /*yield*/, git.fetch('--prune')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, git.branch(opts)];
                case 3:
                    rawBranches = _a.sent();
                    branchSummary_1 = utils.parseBranches(rawBranches);
                    branchList = branchSummary_1.all;
                    myBranches = branchList.filter(function (branchName) {
                        // on the local repo, myBranchSelection will be '' : i.e: all branches will be listed
                        // on the remote, myBranchSelection will be 'remotes/origin/' + username;
                        // cannot delete current branch
                        if (branchName === branchSummary_1.current) {
                            return false;
                        }
                        // ensure branch is not part of the blackList array.
                        if (excludeBlacklist(branchName, exports.blackList)) {
                            return false;
                        }
                        // search for my branch pattern
                        if (branchName.indexOf(myBranchSelection) > -1) {
                            return true;
                        }
                        // default
                        return false;
                    });
                    if (myBranches.includes(branchSummary_1.current)) {
                        console.log(chalk_1.default.yellow("cannot delete " + branchSummary_1.current));
                    }
                    return [2 /*return*/, myBranches];
                case 4:
                    err_1 = _a.sent();
                    console.log('Error listing Branches', err_1);
                    throw err_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deleteRemoteMergedBranches(myBranches) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, myBranches_1, branch, br;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(chalk_1.default.green('Deleting remote branches:'));
                    _i = 0, myBranches_1 = myBranches;
                    _a.label = 1;
                case 1:
                    if (!(_i < myBranches_1.length)) return [3 /*break*/, 4];
                    branch = myBranches_1[_i];
                    br = void 0;
                    if (branch.indexOf('remotes/origin/') === 0) {
                        br = branch.substr('remotes/origin/'.length);
                    }
                    else {
                        br = branch;
                    }
                    // delete branches remotely
                    return [4 /*yield*/, git.push("origin --delete " + br)];
                case 2:
                    // delete branches remotely
                    _a.sent();
                    console.log(chalk_1.default.red("* deleted: " + branch));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteLocalMergedBranch(branchName) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2, agree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 7]);
                    return [4 /*yield*/, git.branch("-d " + branchName)];
                case 1:
                    _a.sent();
                    console.log(chalk_1.default.blue("* deleted: " + branchName));
                    return [3 /*break*/, 7];
                case 2:
                    err_2 = _a.sent();
                    console.log(chalk_1.default.blue("* Failed deleted: " + branchName + " with error: "));
                    console.log(err_2);
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'agree',
                                message: 'Force deletion',
                                default: true,
                            },
                        ])];
                case 3:
                    agree = (_a.sent());
                    if (!agree) return [3 /*break*/, 5];
                    return [4 /*yield*/, git.branch("-D " + branchName)];
                case 4:
                    _a.sent();
                    console.log(chalk_1.default.blue("* deleted: " + branchName));
                    return [3 /*break*/, 6];
                case 5:
                    console.log("* skipped: " + branchName);
                    _a.label = 6;
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function deleteLocalUnMergedBranch(branchName) {
    return __awaiter(this, void 0, void 0, function () {
        var agree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'agree',
                            message: 'This branch is not merged. Confirm Delete',
                            default: true,
                        },
                    ])];
                case 1:
                    agree = (_a.sent());
                    if (!agree) return [3 /*break*/, 3];
                    return [4 /*yield*/, git.branch("-D " + branchName)];
                case 2:
                    _a.sent();
                    console.log(chalk_1.default.red("* deleted: " + branchName));
                    return [3 /*break*/, 4];
                case 3:
                    console.log("* skipped: " + branchName);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function prompt() {
    return __awaiter(this, void 0, void 0, function () {
        var repoType, _a, localMergedBranches, localNoMergedBranches, allMyLocalBranches, myChoiceOfLocalBranches, _i, _b, branch, allMyRemoteBranches, myChoiceOfRemoteBranches, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 18, , 19]);
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'list',
                                name: 'repo',
                                message: 'Where would you like to delete your branches',
                                choices: [RepoType.Local, RepoType.Remote],
                                filter: function (val) {
                                    return val.toLowerCase();
                                },
                            },
                        ])];
                case 1:
                    repoType = (_c.sent());
                    _a = repoType.repo;
                    switch (_a) {
                        case RepoType.Local: return [3 /*break*/, 2];
                        case RepoType.Remote: return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 16];
                case 2:
                    console.log(chalk_1.default.green('Retrieving Local branches...'));
                    return [4 /*yield*/, gitListBranches('-v --merged', false)];
                case 3:
                    localMergedBranches = _c.sent();
                    return [4 /*yield*/, gitListBranches('-v --no-merged', false)];
                case 4:
                    localNoMergedBranches = _c.sent();
                    allMyLocalBranches = [];
                    allMyLocalBranches.push(new inquirer.Separator(' = Merged Branches ='));
                    allMyLocalBranches.push.apply(allMyLocalBranches, localMergedBranches);
                    allMyLocalBranches.push(new inquirer.Separator(' = Un-Merged Branches ='));
                    allMyLocalBranches.push.apply(allMyLocalBranches, localNoMergedBranches);
                    return [4 /*yield*/, inquirer.prompt({
                            type: 'checkbox',
                            name: 'branches',
                            message: 'Which branches would you like to delete',
                            choices: allMyLocalBranches,
                            pageSize: 20,
                        })];
                case 5:
                    myChoiceOfLocalBranches = (_c.sent());
                    console.log(chalk_1.default.green('Deleting local Branches:'));
                    _i = 0, _b = myChoiceOfLocalBranches.branches;
                    _c.label = 6;
                case 6:
                    if (!(_i < _b.length)) return [3 /*break*/, 11];
                    branch = _b[_i];
                    if (!localMergedBranches.includes(branch)) return [3 /*break*/, 8];
                    return [4 /*yield*/, deleteLocalMergedBranch(branch)];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, deleteLocalUnMergedBranch(branch)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 17];
                case 12: return [4 /*yield*/, gitListBranches('-v -a --merged', true)];
                case 13:
                    allMyRemoteBranches = _c.sent();
                    allMyRemoteBranches.push(new inquirer.Separator());
                    return [4 /*yield*/, inquirer.prompt({
                            type: 'checkbox',
                            name: 'branches',
                            message: 'Which branches would you like to delete',
                            choices: allMyRemoteBranches,
                            pageSize: 20,
                        })];
                case 14:
                    myChoiceOfRemoteBranches = (_c.sent());
                    return [4 /*yield*/, deleteRemoteMergedBranches(myChoiceOfRemoteBranches.branches)];
                case 15:
                    _c.sent();
                    return [3 /*break*/, 17];
                case 16:
                    console.log('choice not valid');
                    return [3 /*break*/, 17];
                case 17:
                    console.log(chalk_1.default.green('Done!'));
                    return [3 /*break*/, 19];
                case 18:
                    err_3 = _c.sent();
                    console.log(err_3);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
}
exports.prompt = prompt;
//# sourceMappingURL=GitBranchSweeper.js.map