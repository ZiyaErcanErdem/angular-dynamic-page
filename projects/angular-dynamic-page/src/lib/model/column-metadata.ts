import { RelationType } from './relation-type.enum';
import { ColumnType } from './column-type.enum';
import { Operator } from './operator.enum';
import { OptionContext } from './option-context';
import { PageMetamodel } from './page-metamodel';
import { DynamicSelectorModel } from './dynamic-selector-model';


export interface ColumnMetadata {
    qualifier: string;
    group: string;
    label: string;
    name: string;
    path: string;
    relType: RelationType;
    columnType: ColumnType;
    idColumn?: boolean;
    operators: Array<Operator>;
    defaultValue?: any;
    defaultOperator?: Operator;
    options?: Array<OptionContext>;
    order?: number;
    level?: number;

    nullable?: boolean;
    listable?: boolean;
    showWhenCompact?: boolean;
    showWhenGrid?: boolean;
    gridColWith?: string;
    compactColWidth?: string;
    searchable?: boolean;
    editable?: boolean;
    readonly?: boolean;
    ignorable?: boolean;
    viewable?: boolean;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;

    metamodel?: PageMetamodel;
    selector?: DynamicSelectorModel<any>;
}
