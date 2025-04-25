"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var tsConfigPaths = __importStar(require("tsconfig-paths"));
var promises_1 = require("fs/promises");
var path_1 = __importDefault(require("path"));
var recast_1 = require("recast");
var cacher_1 = __importDefault(require("../../utils/cacher"));
var babel_parser_1 = __importDefault(require("../../babel-parser"));
var resolveExportedComponent_1 = __importDefault(require("../../utils/resolveExportedComponent"));
var tsconfigFilename = 'tsconfig.app.json';
function parseSpreadProperties(spreadElementName, sourceComponentPath, opt) {
    return __awaiter(this, void 0, void 0, function () {
        var source, spreadImportPaths, composableFilePath, propsValuePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSourceCode(sourceComponentPath)];
                case 1:
                    source = _a.sent();
                    spreadImportPaths = getFromPathsInFileByImportsOrExports(source, sourceComponentPath, spreadElementName);
                    return [4 /*yield*/, getComposableFilePath(spreadImportPaths, sourceComponentPath, opt, spreadElementName)];
                case 2:
                    composableFilePath = _a.sent();
                    return [4 /*yield*/, parseAstFromComposableFile(composableFilePath, opt)];
                case 3:
                    propsValuePath = _a.sent();
                    return [2 /*return*/, {
                            propsValuePath: propsValuePath,
                            composableFilePath: composableFilePath,
                        }];
            }
        });
    });
}
exports.default = parseSpreadProperties;
function getSourceCode(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, promises_1.readFile)(path, { encoding: 'utf-8' })];
        });
    });
}
function findClosestTsconfig(startPath) {
    var dir = path_1.default.dirname(startPath);
    while (dir !== path_1.default.dirname(dir)) {
        var candidate = path_1.default.join(dir, tsconfigFilename);
        if ((0, node_fs_1.existsSync)(candidate)) {
            return candidate;
        }
        dir = path_1.default.dirname(dir);
    }
    return null;
}
function getFromPathsInFileByImportsOrExports(source, sourcePath, query) {
    var regExp = /(import|export)(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s](.*?)["'\s];?/g;
    var matches = __spreadArray([], __read(source.matchAll(regExp)), false);
    if (!matches.length) {
        throw new Error('No imports or exports found');
    }
    var tsconfigPath = findClosestTsconfig(sourcePath);
    if (!tsconfigPath) {
        throw new Error("No ".concat(tsconfigFilename, " found"));
    }
    var tsConfig = tsConfigPaths.loadConfig(tsconfigPath);
    if (tsConfig.resultType === 'success') {
        var matchPath_1 = tsConfigPaths.createMatchPath(tsConfig.baseUrl, tsConfig.paths);
        return matches
            .filter(function (match) { return query ? match[0].includes(query) : true; })
            .map(function (match) {
            var rawImport = match[3].trim();
            var resolved = matchPath_1(rawImport);
            return resolved
                ? path_1.default.relative(process.cwd(), resolved)
                : rawImport;
        });
    }
    else {
        throw new Error('Error loading tsconfig.json');
    }
}
function getComposableFilePath(spreadImportPaths, sourcePath, opt, spreadElementName) {
    return __awaiter(this, void 0, void 0, function () {
        var spreadImportPaths_1, spreadImportPaths_1_1, filePath, rawPath, isDirectory, indexFile, paths, composableFileName, paths_1, paths_1_1, fileName, composableFile, e_1_1, composableFilePath, fileContent, e_2_1;
        var e_2, _a, e_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 15, 16, 17]);
                    spreadImportPaths_1 = __values(spreadImportPaths), spreadImportPaths_1_1 = spreadImportPaths_1.next();
                    _c.label = 1;
                case 1:
                    if (!!spreadImportPaths_1_1.done) return [3 /*break*/, 14];
                    filePath = spreadImportPaths_1_1.value;
                    rawPath = path_1.default.join(path_1.default.dirname(sourcePath), filePath);
                    isDirectory = (0, node_fs_1.existsSync)(rawPath);
                    if (!isDirectory) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, promises_1.readFile)(path_1.default.join(rawPath, "index.".concat(opt.lang)), { encoding: 'utf-8' })];
                case 2:
                    indexFile = _c.sent();
                    paths = getFromPathsInFileByImportsOrExports(indexFile, sourcePath);
                    composableFileName = '';
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, 9, 10]);
                    paths_1 = (e_1 = void 0, __values(paths)), paths_1_1 = paths_1.next();
                    _c.label = 4;
                case 4:
                    if (!!paths_1_1.done) return [3 /*break*/, 7];
                    fileName = paths_1_1.value;
                    if (!fileName) return [3 /*break*/, 6];
                    fileName = "".concat(fileName.replace(".".concat(path_1.default.sep), ''), ".").concat(opt.lang);
                    return [4 /*yield*/, (0, promises_1.readFile)(path_1.default.join(rawPath, fileName), { encoding: 'utf-8' })];
                case 5:
                    composableFile = _c.sent();
                    if (composableFile.includes(spreadElementName)) {
                        composableFileName = fileName;
                    }
                    _c.label = 6;
                case 6:
                    paths_1_1 = paths_1.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (paths_1_1 && !paths_1_1.done && (_b = paths_1.return)) _b.call(paths_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/, path_1.default.join(rawPath, composableFileName)];
                case 11:
                    composableFilePath = "".concat(rawPath, ".").concat(opt.lang);
                    return [4 /*yield*/, (0, promises_1.readFile)(composableFilePath, { encoding: 'utf-8' })];
                case 12:
                    fileContent = _c.sent();
                    if (fileContent.includes(spreadElementName)) {
                        return [2 /*return*/, composableFilePath];
                    }
                    _c.label = 13;
                case 13:
                    spreadImportPaths_1_1 = spreadImportPaths_1.next();
                    return [3 /*break*/, 1];
                case 14: return [3 /*break*/, 17];
                case 15:
                    e_2_1 = _c.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 17];
                case 16:
                    try {
                        if (spreadImportPaths_1_1 && !spreadImportPaths_1_1.done && (_a = spreadImportPaths_1.return)) _a.call(spreadImportPaths_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function parseAstFromComposableFile(path, opt) {
    return __awaiter(this, void 0, void 0, function () {
        var plugins_1, composableFile_1, ast, _a, componentDefinitions, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    plugins_1 = opt.lang === 'ts' ? ['typescript'] : ['flow'];
                    if (opt.jsx) {
                        plugins_1.push('jsx');
                    }
                    return [4 /*yield*/, (0, promises_1.readFile)(path, {
                            encoding: 'utf-8'
                        })];
                case 1:
                    composableFile_1 = _b.sent();
                    ast = (0, cacher_1.default)(function () { return (0, recast_1.parse)(composableFile_1, { parser: (0, babel_parser_1.default)({ plugins: plugins_1 }) }); }, composableFile_1);
                    if (!ast) {
                        throw new Error("Unable to parse empty file \"".concat(path, "\""));
                    }
                    _a = __read((0, resolveExportedComponent_1.default)(ast), 1), componentDefinitions = _a[0];
                    // @ts-ignore
                    return [2 /*return*/, componentDefinitions.valueStore[0]];
                case 2:
                    e_3 = _b.sent();
                    throw new Error("Could not read file ".concat(path));
                case 3: return [2 /*return*/];
            }
        });
    });
}
