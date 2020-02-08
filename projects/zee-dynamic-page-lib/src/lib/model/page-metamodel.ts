import { ColumnMetadata } from './column-metadata';
import { RelationType } from './relation-type.enum';
import { PageRelation } from './page-relation';

export class PageMetamodel {
    qualifier: string;
    relType: RelationType;
    idColumnName: string;
    group: string;
    level: number;

    private columns: Array<ColumnMetadata>;
    private aliases: Array<string>;
    public defaultColumn: ColumnMetadata;
    private selfRelation: PageRelation;
    private relationMap: Map<string, PageRelation>;
    private relationList: Array<PageRelation>;

    constructor(source: any) {
        Object.assign(this, source);
        this.columns = Array<ColumnMetadata>();
        this.aliases = Array<string>();
        this.relationMap = new Map<string, PageRelation>();
        this.relationList = new Array<PageRelation>();

        this.selfRelation = new PageRelation(this.relType, this.group, this.qualifier);
        this.selfRelation.metamodel = this;
        this.relationMap.set(this.selfRelation.group, this.selfRelation);
        this.relationList.push(this.selfRelation);

        for (let i = 0; i < source.columns.length; i++) {
            const cmd: ColumnMetadata = Object.assign({}, source.columns[i]);
            this.addColumn(cmd);
        }
        this.addAlias(source.group);
        for (let i = 0; i < source.aliases.length; i++) {
            const alias: string = source.aliases[i];
            this.addAlias(alias);
        }
    }

    public getColumns(): Array<ColumnMetadata> {
        return this.columns;
    }

    public addColumn(cmd: ColumnMetadata): void {
        if (!cmd || !cmd.path) {
            return;
        }
        if (cmd.metamodel) {
            cmd.metamodel = new PageMetamodel(cmd.metamodel);
            const pageRel = new PageRelation(cmd.metamodel.relType, cmd.metamodel.group, cmd.metamodel.qualifier);
            pageRel.metamodel = cmd.metamodel;
            pageRel.connector = cmd;
            this.addRelation(pageRel);
        } else if (!this.defaultColumn) {
            this.defaultColumn = cmd;
        }
        this.columns.push(cmd);
    }

    public addAlias(alias: string): void {
        if (!alias || this.aliases.includes(alias)) {
            return;
        }
        this.aliases.push(alias);
    }

    private addRelation(relation: PageRelation): void {
        this.relationMap.set(relation.group, relation);
        this.relationList.push(relation);

        const excludes = new Array<string>();
        excludes.push(relation.qualifier);
        const parents = relation.metamodel.getAllRelations(excludes);
        parents.forEach(rel => {
            if (!this.relationMap.has(rel.group)) {
                this.relationMap.set(rel.group, rel);
                this.relationList.push(rel);
            }
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

    public findColumn(columnPath: string, ignores?: Array<string>): ColumnMetadata {
        if (!columnPath) {
            return null;
        }
        let searchPath = columnPath;
        const alias = this.aliases.find(a => searchPath.startsWith(a + '.'));
        if (alias) {
            searchPath = searchPath.substr(alias.length + 1);
        }
        let col = this.columns.find(c => c.path === searchPath || c.path === columnPath);

        if (col) {
            return col;
        }

        const ignoreMetaModels = ignores ? ignores : new Array<string>();
        ignoreMetaModels.push(searchPath + '#' + this.qualifier);

        if (!col) {
            for (let i = 0; i < this.relationList.length; i++) {
                const rel = this.relationList[i];
                if (ignoreMetaModels.includes(searchPath + '#' + rel.qualifier)) {
                    continue;
                }
                col = rel.metamodel.findColumn(searchPath, ignoreMetaModels);
                if (col) {
                    return col;
                }
            }
            /*
            this.relationList.forEach(rel => {
                if (col || ignoreMetaModels.includes(rel.qualifier)) {
                    return;
                }
                col = rel.metamodel.findColumn(columnPath, ignoreMetaModels);
            });
            */
        }
        return col;
    }

    public findRelation(col: ColumnMetadata): PageRelation {
        let colRelation: PageRelation;
        this.relationList.forEach(rel => {
            if (!colRelation && rel.metamodel.containsColumn(col)) {
                colRelation = rel;
            }
        });
        return colRelation;
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
}
