import { PageConfig } from './page-config';
import { Operator } from './operator.enum';
import { ColumnMetadata } from './column-metadata';
import { ColumnType } from './column-type.enum';
import { InputType } from './input-type.enum';
import { OptionContext } from './option-context';
import { OperatorContext } from './operator-context';
import { QueryMode } from './query-mode.enum';
import { PageType } from './page-type.enum';
import { BuilderType } from './builder-type.enum';
import { PageRelation } from './page-relation';
import { Theme } from './theme.enum';
import { IDynamicConfig } from './dynamic-config';

export class GenericPageConfig<T> implements PageConfig<T> {
    private defaultClassNames: Map<string, string>;
    private defaultOperatorMap: Map<string, Array<Operator>>;

    public allowEmptyCriteria: boolean;
    public queryMode: QueryMode;
    public classNames?: Map<string, string>;

    public pageTitle: string;
    public pageTheme: Theme;
    public builderType: BuilderType;
    public pageType: PageType;
    public formUpdateOnMode?: 'change' | 'blur' | 'submit';
    public autoSearch: boolean;
    public showPageActions: boolean;
    public showPagination: boolean;
    public canCreate: boolean;
    public canEdit: boolean;
    public canDelete: boolean;
    public canDownloadExcel: boolean;
    public canUploadExcel: boolean;

    public readonly qualifier: string;
    public readonly dynamicConfig: IDynamicConfig;

    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    pageRelation?: PageRelation;

    constructor(prmQualifier: string, prmDynamicConfig: IDynamicConfig) {
        this.qualifier = prmQualifier;
        this.dynamicConfig = prmDynamicConfig;
        this.allowEmptyCriteria = true;
        this.pageTitle = this.toI18n(`${this.qualifier}.home.title`);
        this.pageTheme = Theme.dark;
        this.builderType = BuilderType.PAGE;
        this.pageType = PageType.PAGE;
        this.autoSearch = true;
        this.showPageActions = true;
        this.showPagination = true;
        this.canCreate = true;
        this.canEdit = true;
        this.canDelete = true;
        this.canDownloadExcel = false;
        this.canUploadExcel = false;

        this.page = 1;
        this.previousPage = 1;
        this.reverse = true;
        this.predicate = 'id';
        this.queryMode = QueryMode.CRITERIA;
        this.defaultClassNames = new Map<string, string>();
        this.defaultOperatorMap = new Map<string, Array<Operator>>();
        this.setupDefaultClassNames();
        this.setupDefaultOperatorMap();
    }

    public getClassName(id: string): string {
        let cls = this.classNames ? this.classNames.get(id) : null;
        if (null != cls) {
            return cls;
        }
        cls = this.defaultClassNames.get(id);
        return cls;
    }

    public getDefaultOperator(cmd: ColumnMetadata): Operator {
        if (cmd && cmd.defaultOperator !== undefined) {
            return this.getValueOf(cmd.defaultOperator);
        } else {
            const operators = this.getOperators(cmd);
            if (operators && operators.length) {
                return operators[0].operator;
            } else {
                return null;
            }
        }
    }

    public getOperators(cmd: ColumnMetadata): Array<OperatorContext> {
        let operators: Array<OperatorContext> = new Array<OperatorContext>();
        if (cmd && cmd.operators && cmd.operators.length > 0) {
            const ctx = cmd.operators.map(o => {
                const oc = new OperatorContext(o);
                oc.label = this.toI18nEnum('operator.' + oc.name, 'dynamic.');
                return oc;
            });
            operators = operators.concat(ctx).filter(oc => this.isOperatorAllowed(cmd, oc.operator));
        }
        return operators;
    }

    public toI18nEnum(enumLabel: string, prefix?: string): string {
        const i18nEnumPrefix = prefix ? prefix : this.toI18nEnumPrefix();
        if (!enumLabel || enumLabel.startsWith(i18nEnumPrefix)) {
            return enumLabel;
        }
        return i18nEnumPrefix + enumLabel;
    }

    public toI18nEntity(entityLabel: string, prefix?: string): string {
        /*
        if (!this.dynamicConfig.microserviceName) {
            entityLabel = this.uncapitalizeFirstLetter(entityLabel);
        }
        */
        const i18nEntityPrefix = prefix ? prefix : this.toI18nEntityPrefix();
        if (!entityLabel || entityLabel.startsWith(i18nEntityPrefix)) {
            return entityLabel;
        }
        if (!prefix && i18nEntityPrefix && !entityLabel.startsWith('.')) {
            entityLabel = '.' + entityLabel;
        }
        return i18nEntityPrefix + entityLabel;
    }

    public toI18n(label: string, prefix?: string, uncapitalizeFirstLetter?: boolean): string {
        if (!this.dynamicConfig.microserviceName) {
            label = this.uncapitalizeFirstLetter(label);
            uncapitalizeFirstLetter = true;
        }
        const i18nLabelPrefix = prefix ? prefix : this.toI18nLabelPrefix();
        if (!label || label.startsWith(i18nLabelPrefix)) {
            return label;
        }
        label = (uncapitalizeFirstLetter ? label : this.capitalizeFirstLetter(label));
        if (!prefix && i18nLabelPrefix && !label.startsWith('.')) {
            label = '.' + label;
        }
        return i18nLabelPrefix + label;
    }

    private toI18nLabelPrefix(): string {
        let prefix = '';
        if (this.dynamicConfig && this.dynamicConfig.i18nPrefix) {
            prefix = this.dynamicConfig.i18nPrefix + (this.dynamicConfig.i18nAppName ? '.' + this.dynamicConfig.i18nAppName : '');
        } else {
            prefix = this.dynamicConfig.i18nAppName ? this.dynamicConfig.i18nAppName : '';
        }
        return prefix;
    }

    private toI18nEntityPrefix(): string {
        let prefix = '';
        if (this.dynamicConfig && this.dynamicConfig.i18nAppName) {
            prefix = 'dynamic.page.' + this.dynamicConfig.i18nAppName;
        } else {
            prefix = 'dynamic.page';
        }
        return prefix;
    }

    private toI18nEnumPrefix(): string {
        return this.dynamicConfig.i18nPrefix ? this.dynamicConfig.i18nPrefix + '.' : '';
    }

    public capitalizeFirstLetter(txt: string): string {
        return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt;
    }

    public uncapitalizeFirstLetter(txt: string): string {
        return txt ? txt.charAt(0).toLowerCase() + txt.slice(1) : txt;
    }

    private isOperatorAllowed(cmd: ColumnMetadata, operator: Operator): boolean {
        if (this.queryMode === QueryMode.EXAMPLE) {
            if (cmd.columnType === ColumnType.STRING) {
                switch (operator) {
                    case Operator.EQ:
                    case Operator.LIKE:
                        return true;
                    default:
                        return false;
                }
            } else {
                return operator === Operator.EQ;
            }
        }
        return true;
    }

    public getColumnType(cmd: ColumnMetadata, operator: Operator): ColumnType {
        const type = cmd ? cmd.columnType : null;
        switch (operator) {
            case Operator.IS_NULL:
            case Operator.IS_NOT_NULL:
                return null; // No displayed component
            default:
                return type;
        }
    }

    public getInputType(cmd: ColumnMetadata, operator: Operator): InputType {
        const type = cmd ? cmd.columnType : null;
        switch (operator) {
            case Operator.IS_NULL:
            case Operator.IS_NOT_NULL:
                return null; // No displayed component
            case Operator.IN:
            case Operator.NOT_IN:
                return InputType.multiselect;
            default: {
                switch (type) {
                    case ColumnType.DATE:
                        return InputType.date;
                    case ColumnType.DOUBLE:
                    case ColumnType.NUMBER:
                        return InputType.number;
                    case ColumnType.ENUM:
                        return InputType.enum;
                    case ColumnType.STRING:
                        return InputType.string;
                    case ColumnType.BOOLEAN:
                        return InputType.boolean;
                    default:
                        return InputType.string;
                }
            }
        }
    }

    public getOptions(cmd: ColumnMetadata): Array<OptionContext> {
        return cmd ? cmd.options || new Array<OptionContext>() : new Array<OptionContext>();
    }

    private getValueOf(param: any): any {
        switch (typeof param) {
            case 'function':
                return param();
            default:
                return param;
        }
    }

    private setupDefaultClassNames(): void {
        this.defaultClassNames.set('removeIcon', 'q-icon q-remove-icon');
        this.defaultClassNames.set('addIcon', 'q-icon q-add-icon');
        this.defaultClassNames.set('button', 'q-button');
        this.defaultClassNames.set('criteriaAction', 'q-criteria-action');
        this.defaultClassNames.set('criteriCondition', 'q-criteria-condition');
        this.defaultClassNames.set('queryTree', 'q-tree');
        this.defaultClassNames.set('queryItem', 'q-item');
        this.defaultClassNames.set('queryPredicate', 'q-predicate');
        this.defaultClassNames.set('queryCriteria', 'q-criteria');
        this.defaultClassNames.set('invalidCriteria', 'q-invalid-criteria');
        this.defaultClassNames.set('emptyWarning', 'q-empty-warning');
        this.defaultClassNames.set('fieldControl', 'q-field-control');
        this.defaultClassNames.set('operatorControl', 'q-operator-control');
        this.defaultClassNames.set('inputControl', 'q-input-control');
    }

    private setupDefaultOperatorMap(): void {
        this.defaultOperatorMap.set(
            'string',
            [Operator.EQ, Operator.NOT_EQ, Operator.EW, Operator.NOT_EW, Operator.SW, Operator.NOT_SW, Operator.LIKE, Operator.NOT_LIKE]
        );
        this.defaultOperatorMap.set('number', [Operator.EQ, Operator.NOT_EQ, Operator.GT, Operator.GTE, Operator.LT, Operator.LTE]);
        this.defaultOperatorMap.set('time', [Operator.EQ, Operator.NOT_EQ, Operator.GT, Operator.GTE, Operator.LT, Operator.LTE]);
        this.defaultOperatorMap.set('date', [Operator.EQ, Operator.NOT_EQ, Operator.GT, Operator.GTE, Operator.LT, Operator.LTE]);
        this.defaultOperatorMap.set('enum', [Operator.EQ, Operator.NOT_EQ]);
        this.defaultOperatorMap.set('boolean', [Operator.EQ]);
    }
}
