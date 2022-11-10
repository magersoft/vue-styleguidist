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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const recast_1 = require("recast");
const util_1 = require("util");
const fs_1 = require("fs");
const resolveExportedComponent_1 = __importDefault(require("../../utils/resolveExportedComponent"));
const cacher_1 = __importDefault(require("../../utils/cacher"));
const babel_parser_1 = __importDefault(require("../../babel-parser"));
const read = (0, util_1.promisify)(fs_1.readFile);
function getSpreadProperties(node, opt, documentation) {
    return __awaiter(this, void 0, void 0, function* () {
        const spreadElementName = 
        // @ts-ignore
        node.argument.type === 'CallExpression' ? node.argument.callee.name : node.argument.name;
        const source = yield read(documentation.componentFullfilePath, { encoding: 'utf-8' });
        const spreadImportPaths = getFromPathsInFileByImportsOrExports(source, spreadElementName);
        const composableDirPath = getFullPathToComposableDir(documentation, spreadImportPaths);
        const composableFilePath = yield getComposableFilePath(composableDirPath, opt, spreadElementName);
        return parseAstFromComposableFile(composableFilePath, opt);
    });
}
exports.default = getSpreadProperties;
function getFromPathsInFileByImportsOrExports(source, query) {
    const regExp = /^(import|export)(?:.*?(as))?(?:.*?(as))?(?:.*?(from))*.*$/gm;
    const imports = source.match(regExp);
    const fromImportsOrExports = imports
        .filter(item => (query ? item.includes(query) : true))
        .map(item => {
        const importFrom = item.match(/(?<=from).+/);
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
    const importPath = paths.toString().split(path_1.default.sep);
    const componentPath = documentation.componentFullfilePath.split(path_1.default.sep);
    const prependPath = componentPath
        .slice(0, componentPath.length - importPath.filter(i => i === '..').length - 1)
        .join(path_1.default.sep);
    return path_1.default.join(prependPath, importPath.filter(i => i !== '..').join(path_1.default.sep));
}
function getComposableFilePath(dirPath, opt, spreadElementName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const indexFile = yield read(path_1.default.join(dirPath, `index.${opt.lang}`), { encoding: 'utf-8' });
            const paths = getFromPathsInFileByImportsOrExports(indexFile);
            let composableFileName = '';
            for (let fileName of paths) {
                if (fileName) {
                    fileName = `${fileName.replace(`.${path_1.default.sep}`, '')}.${opt.lang}`;
                    const composableFile = yield read(path_1.default.join(dirPath, fileName), { encoding: 'utf-8' });
                    if (composableFile.includes(spreadElementName)) {
                        composableFileName = fileName;
                    }
                }
            }
            return path_1.default.join(dirPath, composableFileName);
        }
        catch (e) {
            const singleFilePath = path_1.default.join(`${dirPath}.${opt.lang}`);
            try {
                const composableFile = yield read(path_1.default.join(singleFilePath), { encoding: 'utf-8' });
                if (composableFile.includes(spreadElementName)) {
                    return singleFilePath;
                }
            }
            catch (e) {
                throw new Error(`Could not read file ${singleFilePath}`);
            }
            throw new Error(`Could not read file ${dirPath}`);
        }
    });
}
function parseAstFromComposableFile(path, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const plugins = opt.lang === 'ts' ? ['typescript'] : ['flow'];
            if (opt.jsx) {
                plugins.push('jsx');
            }
            const composableFile = yield read(path, {
                encoding: 'utf-8'
            });
            const ast = (0, cacher_1.default)(() => (0, recast_1.parse)(composableFile, { parser: (0, babel_parser_1.default)({ plugins }) }), composableFile);
            if (!ast) {
                throw new Error(`Unable to parse empty file "${path}"`);
            }
            const [componentDefinitions] = (0, resolveExportedComponent_1.default)(ast);
            // @ts-ignore
            return componentDefinitions.valueStore[0];
        }
        catch (e) {
            throw new Error(`Could not read file ${path}`);
        }
    });
}
