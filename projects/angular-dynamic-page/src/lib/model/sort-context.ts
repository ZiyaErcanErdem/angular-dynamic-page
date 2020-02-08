import { ColumnMetadata } from './column-metadata';

export interface SortContext {
    direction: string;
    column: ColumnMetadata;
}
