"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var recast_1 = require("recast");
var util_1 = require("util");
var fs_1 = require("fs");
var resolveExportedComponent_1 = __importDefault(require("../../utils/resolveExportedComponent"));
var cacher_1 = __importDefault(require("../../utils/cacher"));
var babel_parser_1 = __importDefault(require("../../babel-parser"));
var read = (0, util_1.promisify)(fs_1.readFile);
function getSpreadProperties(node, opt, documentation) {
    return __awaiter(this, void 0, void 0, function () {
        var spreadElementName, source, spreadImportPaths, composableDirPath, composableFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spreadElementName = 
                    // @ts-ignore
                    node.argument.type === 'CallExpression' ? node.argument.callee.name : node.argument.name;
                    return [4 /*yield*/, read(documentation.componentFullfilePath, { encoding: 'utf-8' })];
                case 1:
                    source = _a.sent();
                    spreadImportPaths = getFromPathsInFileByImportsOrExports(source, spreadElementName);
                    composableDirPath = getFullPathToComposableDir(documentation, spreadImportPaths);
                    return [4 /*yield*/, getComposableFilePath(composableDirPath, opt, spreadElementName)];
                case 2:
                    composableFilePath = _a.sent();
                    return [2 /*return*/, parseAstFromComposableFile(composableFilePath, opt)];
            }
        });
    });
}
exports.default = getSpreadProperties;
function getFromPathsInFileByImportsOrExports(source, query) {
    var regExp = /(import|export)(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
    var imports = source.match(regExp);
    var fromImportsOrExports = imports
        .filter(function (item) { return (query ? item.includes(query) : true); })
        .map(function (item) {
        var importFrom = item.match(/(?<=from).+/);
        if (importFrom) {
            return importFrom[0].replace(' ', '').replaceAll("'", '').replace(';', '');
        }
        return null;
    });
    if (!fromImportsOrExports) {
        throw new Error('Not found imports or exports in file');
    }
    return fromImportsOrExports;
}
function getFullPathToComposableDir(documentation, paths) {
    var importPath = paths.toString().split(path_1.default.sep);
    var componentPath = documentation.componentFullfilePath.split(path_1.default.sep);
    var prependPath = componentPath
        .slice(0, componentPath.length - importPath.filter(function (i) { return i === '..'; }).length - 1)
        .join(path_1.default.sep);
    return path_1.default.join(prependPath, importPath.filter(function (i) { return i !== '..'; }).join(path_1.default.sep));
}
function getComposableFilePath(dirPath, opt, spreadElementName) {
    return __awaiter(this, void 0, void 0, function () {
        var indexFile, paths, composableFileName, paths_1, paths_1_1, fileName, composableFile, e_1_1, e_2, singleFilePath, composableFile, e_3;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 15]);
                    return [4 /*yield*/, read(path_1.default.join(dirPath, "index.".concat(opt.lang)), { encoding: 'utf-8' })];
                case 1:
                    indexFile = _b.sent();
                    paths = getFromPathsInFileByImportsOrExports(indexFile);
                    composableFileName = '';
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 9]);
                    paths_1 = __values(paths), paths_1_1 = paths_1.next();
                    _b.label = 3;
                case 3:
                    if (!!paths_1_1.done) return [3 /*break*/, 6];
                    fileName = paths_1_1.value;
                    if (!fileName) return [3 /*break*/, 5];
                    fileName = "".concat(fileName.replace(".".concat(path_1.default.sep), ''), ".").concat(opt.lang);
                    return [4 /*yield*/, read(path_1.default.join(dirPath, fileName), { encoding: 'utf-8' })];
                case 4:
                    composableFile = _b.sent();
                    if (composableFile.includes(spreadElementName)) {
                        composableFileName = fileName;
                    }
                    _b.label = 5;
                case 5:
                    paths_1_1 = paths_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/, path_1.default.join(dirPath, composableFileName)];
                case 10:
                    e_2 = _b.sent();
                    singleFilePath = path_1.default.join("".concat(dirPath, ".").concat(opt.lang));
                    _b.label = 11;
                case 11:
                    _b.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, read(path_1.default.join(singleFilePath), { encoding: 'utf-8' })];
                case 12:
                    composableFile = _b.sent();
                    if (composableFile.includes(spreadElementName)) {
                        return [2 /*return*/, singleFilePath];
                    }
                    return [3 /*break*/, 14];
                case 13:
                    e_3 = _b.sent();
                    throw new Error("Could not read file ".concat(singleFilePath));
                case 14: throw new Error("Could not read file ".concat(dirPath));
                case 15: return [2 /*return*/];
            }
        });
    });
}
function parseAstFromComposableFile(path, opt) {
    return __awaiter(this, void 0, void 0, function () {
        var plugins_1, composableFile_1, ast, _a, componentDefinitions, e_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    plugins_1 = opt.lang === 'ts' ? ['typescript'] : ['flow'];
                    if (opt.jsx) {
                        plugins_1.push('jsx');
                    }
                    return [4 /*yield*/, read(path, {
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
                    e_4 = _b.sent();
                    throw new Error("Could not read file ".concat(path));
                case 3: return [2 /*return*/];
            }
        });
    });
}
