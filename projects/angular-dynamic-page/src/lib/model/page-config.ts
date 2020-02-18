import { ColumnMetadata } from './column-metadata';
import { OperatorContext } from './operator-context';
import { Operator } from './operator.enum';
import { ColumnType } from './column-type.enum';
import { InputType } from './input-type.enum';
import { OptionContext } from './option-context';
import { QueryMode } from './query-mode.enum';
import { PageType } from './page-type.enum';
import { ManagerType } from './manager-type.enum';
import { PageRelation } from './page-relation';
import { Theme } from './theme.enum';
import { IDynamicConfig } from './dynamic-config';

export interface PageConfig<T> {
    managerType: ManagerType;
    readonly qualifier: string;
    readonly dynamicConfig: IDynamicConfig;
    // readonly i18nPrefix: string;
    // readonly i18nAppName: string;
    // readonly appPathPrefix: string;
    pageTitle: string;
    pageTheme: Theme;
    pageType: PageType;
    formUpdateOnMode?: 'change' | 'blur' | 'submit';
    autoSearch: boolean;
    showPageActions: boolean;
    showPagination: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canDownloadExcel: boolean;
    canUploadExcel: boolean;

    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    pageRelation?: PageRelation;

    queryMode: QueryMode;
    allowEmptyCriteria: boolean;
    toI18n: (enumLabel: string, prefix?: string, uncapitalizeFirstLetter?: boolean) => string;
    toI18nEnum: (enumLabel: string, prefix?: string) => string;
    toI18nEntity: (entityLabel: string, prefix?: string) => string;
    capitalizeFirstLetter: (txt: string) => string;
    uncapitalizeFirstLetter: (txt: string) => string;
    getClassName: (id: string) => string;
    getOperators: (cmd: ColumnMetadata) => Array<OperatorContext>;
    getColumnType: (cmd: ColumnMetadata, operator: Operator) => ColumnType;
    getInputType: (cmd: ColumnMetadata, operator: Operator) => InputType;
    getOptions: (cmd: ColumnMetadata) => Array<OptionContext>;
    getDefaultOperator: (cmd: ColumnMetadata) => Operator;
}
