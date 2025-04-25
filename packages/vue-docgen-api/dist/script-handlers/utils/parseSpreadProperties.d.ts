import type { ParseOptions } from '../../types';
export default function parseSpreadProperties(spreadElementName: string, sourceComponentPath: string, opt: ParseOptions): Promise<{
    propsValuePath: any;
    composableFilePath: string | undefined;
}>;
