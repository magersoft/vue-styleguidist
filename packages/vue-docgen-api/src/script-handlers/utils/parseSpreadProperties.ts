import { existsSync } from 'node:fs'
import * as tsConfigPaths from 'tsconfig-paths'
import { readFile } from 'fs/promises'
import path from 'path'
import type { ParserPlugin } from '@babel/parser'
import { parse } from 'recast'
import type { ParseOptions } from '../../types'
import cacher from '../../utils/cacher'
import buildParser from '../../babel-parser'
import resolveExportedComponent from '../../utils/resolveExportedComponent'

const tsconfigFilename = 'tsconfig.app.json'

export default async function parseSpreadProperties(
	spreadElementName: string,
	sourceComponentPath: string,
	opt: ParseOptions
) {
	const source = await getSourceCode(sourceComponentPath)
	const spreadImportPaths = getFromPathsInFileByImportsOrExports(
		source,
		sourceComponentPath,
		spreadElementName
	)
	const composableFilePath = await getComposableFilePath(
		spreadImportPaths,
		sourceComponentPath,
		opt,
		spreadElementName
	)
	const propsValuePath = await parseAstFromComposableFile(composableFilePath!, opt)

	return {
		propsValuePath,
		composableFilePath
	}
}

async function getSourceCode(path: string) {
	return readFile(path, { encoding: 'utf-8' })
}

function findClosestTsconfig(startPath: string): string | null {
	let dir = path.dirname(startPath)
	while (dir !== path.dirname(dir)) {
		const candidate = path.join(dir, tsconfigFilename)
		if (existsSync(candidate)) {
			return candidate
		}
		dir = path.dirname(dir)
	}
	return null
}

function getFromPathsInFileByImportsOrExports(source: string, sourcePath: string, query?: string) {
	const regExp = /(import|export)(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s](.*?)["'\s];?/g
	const matches = [...source.matchAll(regExp)]
	if (!matches.length) {
		throw new Error('No imports or exports found')
	}

	const tsconfigPath = findClosestTsconfig(sourcePath)

	if (!tsconfigPath) {
		throw new Error(`No ${tsconfigFilename} found`)
	}

	const tsConfig = tsConfigPaths.loadConfig(tsconfigPath)

	if (tsConfig.resultType === 'success') {
		const matchPath = tsConfigPaths.createMatchPath(tsConfig.baseUrl!, tsConfig.paths)

		return matches
			.filter(match => (query ? match[0].includes(query) : true))
			.map(match => {
				const rawImport = match[3].trim()
				const resolved = matchPath(rawImport)
				return resolved ? path.relative(process.cwd(), resolved) : rawImport
			})
	} else {
		throw new Error('Error loading tsconfig.json')
	}
}

async function getComposableFilePath(
	spreadImportPaths: string[],
	sourcePath: string,
	opt: ParseOptions,
	spreadElementName: string
) {
	for (const filePath of spreadImportPaths) {
		const rawPath = path.join(path.dirname(sourcePath), filePath)
		const isDirectory = existsSync(rawPath)

		if (isDirectory) {
			const indexFile = await readFile(path.join(rawPath, `index.${opt.lang}`), {
				encoding: 'utf-8'
			})
			const paths = getFromPathsInFileByImportsOrExports(indexFile, sourcePath)

			let composableFileName = ''
			for (let fileName of paths) {
				if (fileName) {
					fileName = `${fileName.replace(`.${path.sep}`, '')}.${opt.lang}`
					const composableFile = await readFile(path.join(rawPath, fileName), { encoding: 'utf-8' })
					if (composableFile.includes(spreadElementName)) {
						composableFileName = fileName
					}
				}
			}

			return path.join(rawPath, composableFileName)
		} else {
			const composableFilePath = `${rawPath}.${opt.lang}`
			const fileContent = await readFile(composableFilePath, { encoding: 'utf-8' })

			if (fileContent.includes(spreadElementName)) {
				return composableFilePath
			}
		}
	}
}

async function parseAstFromComposableFile(path: string, opt: ParseOptions) {
	try {
		const plugins: ParserPlugin[] = opt.lang === 'ts' ? ['typescript'] : ['flow']

		if (opt.jsx) {
			plugins.push('jsx')
		}

		const composableFile = await readFile(path, {
			encoding: 'utf-8'
		})

		const ast = cacher(
			() => parse(composableFile, { parser: buildParser({ plugins }) }),
			composableFile
		)

		if (!ast) {
			throw new Error(`Unable to parse empty file "${path}"`)
		}

		const [componentDefinitions] = resolveExportedComponent(ast)

		// @ts-ignore
		return componentDefinitions.valueStore[0]
	} catch (e) {
		throw new Error(`Could not read file ${path}`)
	}
}
