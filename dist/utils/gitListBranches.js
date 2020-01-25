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
var chalk_1 = require("chalk");
var branchPattern_1 = require("./branchPattern");
var parseBranches_1 = require("./parseBranches");
var excludeBlacklist_1 = require("./excludeBlacklist");
var git = require('cmd-executor').git;
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
                        myBranchSelection = "remotes/origin/" + branchPattern_1.myBranchPattern;
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
                    branchSummary_1 = parseBranches_1.parseBranches(rawBranches);
                    branchList = branchSummary_1.all;
                    myBranches = branchList.filter(function (branchName) {
                        // on the local repo, myBranchSelection will be '' : i.e: all branches will be listed
                        // on the remote, myBranchSelection will be 'remotes/origin/' + username;
                        // cannot delete current branch
                        if (branchName === branchSummary_1.current) {
                            console.log(chalk_1.default.blue(chalk_1.default.bold(branchSummary_1.current) + " is active and cannot be deleted"));
                            return false;
                        }
                        // ensure branch is not part of the blackList array.
                        if (excludeBlacklist_1.excludeBlacklist(branchName, branchPattern_1.blackListPattern)) {
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
exports.gitListBranches = gitListBranches;
//# sourceMappingURL=gitListBranches.js.map