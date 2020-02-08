import { ColumnMetadata } from './column-metadata';

export class ExpressionContext {
    name: string;
    value?: string;
    metadata: ColumnMetadata;

    constructor(cmd: ColumnMetadata) {
        this.metadata = cmd;
        this.name = cmd.name;
    }
}
