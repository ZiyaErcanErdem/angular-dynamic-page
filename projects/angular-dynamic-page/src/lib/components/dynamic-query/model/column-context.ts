import { ColumnMetadata } from '../../../model/column-metadata';

export class ColumnContext {
    name: string;
    path: string;
    metadata: ColumnMetadata;

    constructor(cmd: ColumnMetadata) {
        this.metadata = cmd;
        this.name = cmd.name;
        this.path = cmd.path;
    }
}
