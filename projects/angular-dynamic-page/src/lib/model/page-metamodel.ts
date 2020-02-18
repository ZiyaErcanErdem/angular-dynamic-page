import { ColumnMetadata } from './column-metadata';
import { RelationType } from './relation-type.enum';
import { PageRelation } from './page-relation';
import { ColumnType } from './column-type.enum';
import { Operator } from './operator.enum';

export class PageMetamodel {
    public readonly parent: PageMetamodel;
    qualifier: string;
    group: string;
    path: string;
    relType: RelationType;
    key: string;
    
    level: number;

    private columns: Array<ColumnMetadata>;
    private aliases: Array<string>;
    public defaultColumn: ColumnMetadata;
    private selfRelation: PageRelation;
    private relationMap: Map<string, PageRelation>;
    private relationList: Array<PageRelation>;

    constructor(source: any, parent: PageMetamodel, parentColumn?: ColumnMetadata) {
        this.parent = parent;
        this.parse({...source}, parentColumn);
    }

    private parse(source: any, parentColumn?: ColumnMetadata): void {

        const operators = source.operators ? this.parseOperators(source.operators) : undefined;;
        const sourceColumns =  source.columns;
        const sourceAliases = source.aliases;

        delete source.columns;
        delete source.operator;
        delete source.aliases;

        Object.assign(this, source);

        this.relationMap = new Map<string, PageRelation>();
        this.relationList = new Array<PageRelation>();

        this.selfRelation = new PageRelation(this, this.parent);
        this.relationMap.set(this.selfRelation.group, this.selfRelation);
        this.relationMap.set(this.selfRelation.path, this.selfRelation);
        this.relationList.push(this.selfRelation);

        this.columns =  Array.from(sourceColumns).filter(c => !!c['name']).map(c => this.createColumnMetadata(c, operators, parentColumn));
        this.aliases = Array.from(sourceAliases).map(a => `${a}`);

    }

    private parseOperators(ops: any): Map<ColumnType, Array<Operator>> {
        const operators = new Map<ColumnType, Array<Operator>>();
        if (ops) {
            Object.keys(ops).forEach( key => {
                const val = ops[key];            
                if (val) {
                    const colType: ColumnType = ColumnType[key];
                    if (colType) {
                        operators.set(colType, Array.from(val));
                    }                
                }            
            });
        }
        return operators;
    }

    private createColumnMetadata(source: any, operators: Map<ColumnType, Array<Operator>>, parentColumn?: ColumnMetadata): ColumnMetadata {

        const cmdSource = {...source};
        const features: string = cmdSource.features;
        delete cmdSource.features;

        const cmd: ColumnMetadata = Object.assign({}, cmdSource);

        cmd.parent = this;
        cmd.parentColumn = parentColumn;
        cmd.qualifier = this.qualifier;
        cmd.group = this.group;
        cmd.level = this.level;
        if(!cmd.path) {
            cmd.path = `${(this.path && this.path.length > 0 ? this.path + '.' : '')}${cmd.name}` ;
        }
        if(!cmd.relType) {
            cmd.relType = cmd.metamodel ? cmd.metamodel.relType : this.relType ;
        }
        if(!cmd.label) {
            cmd.label = `${cmd.qualifier}.${cmd.name}` ;
        }
        if (operators) {
            cmd.operators = operators.get(cmd.columnType);
        }

        this.setColumnDefaults(cmd);
        
        if (features) {
            this.enhanceFeatures(cmd, features);
        }
        
        if (cmd.metamodel) {
            cmd.metamodel = new PageMetamodel(cmd.metamodel, this, cmd);
            cmd.relation = new PageRelation(cmd.metamodel, this);
            cmd.relation.connector = cmd;
            this.addRelation(cmd.relation);
        } else if (!this.defaultColumn) {
            this.defaultColumn = cmd;
        }

        return cmd;
    }

    private setColumnDefaults(cmd: ColumnMetadata): void {
        if(ColumnType.ENUM === cmd.columnType) {
            cmd.defaultOperator = Operator.EQ;
            if (cmd.options && cmd.options.length > 0) {
                cmd.defaultValue = cmd.options[0].value;
            }
		}else if(ColumnType.NUMBER == cmd.columnType || ColumnType.DOUBLE == cmd.columnType) {
			cmd.defaultValue = 0;
			cmd.defaultOperator = Operator.GT;
		}else if(ColumnType.DATE == cmd.columnType) {
			cmd.defaultValue = null;
			cmd.defaultOperator = Operator.GT;
		}else if(ColumnType.STRING == cmd.columnType) {
			cmd.defaultValue = '';
			cmd.defaultOperator = Operator.LIKE;
		}else if(ColumnType.BOOLEAN == cmd.columnType) {
			cmd.defaultValue = false;
			cmd.defaultOperator = Operator.EQ;
		}
    }

    private enhanceFeatures(cmd: ColumnMetadata, features: string): void {

        if (!features) {
            return;
        }

        //   0     1      2    3    4    5     6
        // |null|search|list|view|edit|ignore|isId
         
        const arrFeatures = features.split('|');
        cmd.nullable = arrFeatures[0] === '1' ? true : false;
        cmd.searchable = arrFeatures[1] === '1' ? true : false;
        cmd.listable = arrFeatures[2] === '1' ? true : false;
        cmd.viewable = arrFeatures[3] === '1' ? true : false;
        cmd.editable = arrFeatures[4] === '1' ? true : false;
        cmd.ignorable = arrFeatures[5] === '1' ? true : false;
        cmd.idColumn = arrFeatures[6] === '1' ? true : false;
    }

    public getColumns(): Array<ColumnMetadata> {
        return this.columns;
    }


    private addRelation(relation: PageRelation): void {
        this.relationMap.set(relation.group, relation);
        this.relationMap.set(relation.path, relation);
        this.relationList.push(relation);

        const excludes = new Array<string>();
        excludes.push(relation.qualifier);
        const parents = relation.metamodel.getAllRelations(excludes);
        parents.forEach(rel => {
            if (!this.relationMap.has(rel.group)) {
                this.relationMap.set(rel.group, rel);
                this.relationList.push(rel);
            }
            this.relationMap.set(rel.path, rel);
        });
    }

    public getRelation(group): PageRelation {
        if (!group) {
            return undefined;
        }
        return this.relationMap.get(group);
    }

    public getRelations(): Array<PageRelation> {
        return this.relationList;
    }

    public getAllRelations(excludes?: Array<string>): Array<PageRelation> {
        let rels = new Array<PageRelation>();
        excludes = excludes ? excludes : new Array<string>();
        rels = rels.concat(this.relationList.filter(r => !excludes.includes(r.qualifier)));
        rels.map(r => r.qualifier).forEach(q => {
            if (!excludes.includes(q)) {
                excludes.push(q);
            }
        });
        this.relationList.filter(r => r !== this.selfRelation).forEach(r => {
            if (!rels.includes(r)) {
                rels.push(r);
            }
            rels = rels.concat(r.metamodel.getAllRelations(excludes));
        });
        return rels;
    }

    public getAssociationColumns(): Array<ColumnMetadata> {
        return this.columns.filter(col => col.relType !== RelationType.SELF);
    }

    public getSelfRelation(): PageRelation {
        return this.selfRelation;
    }

    public containsColumn(col: ColumnMetadata): boolean {
        return this.columns.includes(col);
    }

    public findColumn(columnPath: string): ColumnMetadata {
        if (!columnPath) {
            return null;
        }
        const paths = columnPath.split('.');
        paths.pop();
        const relationPath = paths.join('.');

        const rel = this.relationMap.get(relationPath);
        if (rel) {
            const col = rel.metamodel.columns.find(c => c.path === columnPath);
            return col;
        }
        return null;
    }

    public findRelation(col: ColumnMetadata): PageRelation {
        return col.relation ? col.relation : col.parentColumn ? col.parentColumn.relation : col.parent.selfRelation;
    }

    public getDefaultColumn(): ColumnMetadata {
        if (!this.defaultColumn) {
            this.columns.forEach((cmd, key, map) => {
                if (!this.defaultColumn) {
                    this.defaultColumn = cmd;
                }
            });
        }
        return this.defaultColumn;
    }

    public getInstanceId(): string {
        return `${this.parent ? this.parent.getInstanceId() + '.' : ''}${this.qualifier}`;
    }
}
