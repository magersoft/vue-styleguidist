import * as bt from '@babel/types';
import { SpreadElement } from '@babel/types';
import { NodePath } from 'ast-types/lib/node-path';
import Documentation from '../../Documentation';
import { ParseOptions } from '../../parse';
export default function getSpreadProperties(node: SpreadElement, opt: ParseOptions, documentation: Documentation): Promise<NodePath<bt.ObjectExpression, any>>;
