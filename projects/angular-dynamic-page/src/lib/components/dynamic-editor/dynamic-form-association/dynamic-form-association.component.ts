import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { PageManager } from '../../../model/page-manager';
import { EditorMode } from '../../../model/editor-mode.enum';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ColumnMetadata } from '../../../model/column-metadata';
import { PageMetamodel } from '../../../model/page-metamodel';
import { PageRelation } from '../../../model/page-relation';
import { PageConfig } from '../../../model/page-config';
import { ColumnType } from '../../../model/column-type.enum';
import { BuilderType } from '../../../model/builder-type.enum';
import { PageType } from '../../../model/page-type.enum';
import { CriteriaBuilder } from '../../../model/query-builder';
import { Operator } from '../../../model/operator.enum';
import { Condition } from '../../../model/condition.enum';
import { PageViewMode } from '../../../model/page-view-mode.enum';
import { FormItemConfig } from '../model/form-item-config';
import { FormFieldConfig } from '../model/form-field-config';

@Component({
  selector: 'zee-dynamic-form-association',
  templateUrl: './dynamic-form-association.component.html',
  styleUrls: ['./dynamic-form-association.component.scss']
})
export class DynamicFormAssociationComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  builder: PageManager<any>;
  @Input()
  mode: EditorMode;
  @Input()
  itemConfig: FormItemConfig;

  group: FormGroup;
  column: ColumnMetadata;
  parentMetamodel: PageMetamodel;
  pageMetamodel: PageMetamodel;
  pageRelation: PageRelation;

  key: string;
  idItemConfig: FormItemConfig;
  idField: FormFieldConfig;
  idColumn: ColumnMetadata;

  descColumnName: string;
  descItemConfig: FormItemConfig;
  descField: FormFieldConfig;
  descColumn: ColumnMetadata;

  entities: Array<any>;
  ready = false;
  isChildBuilder: boolean;

  private associationBuilder: PageManager<any>;
  private config: PageConfig<any>;

  constructor() {
      super();
      this.entities = [];
      this.isChildBuilder = false;
  }

  get qualifier(): string {
    return this.column ? this.column.qualifier : this.itemConfig.field.metadata.qualifier;
}

  get isChild(): boolean {
      if (this.isChildBuilder && this.mode !== EditorMode.VIEW && this.column) {
        const topQualifier = this.builder.top().qualifier;
        const currentQualifier = this.pageMetamodel.qualifier;
        return topQualifier === currentQualifier;
      } else {
          return this.isChildBuilder;
      }
  }

  get editable(): boolean {
    return (this.mode === EditorMode.CREATE || this.mode === EditorMode.EDIT);
  }

  get control(): AbstractControl {
      return this.group.controls[this.idColumn.name];
  }

  get required(): boolean | null {
      const val = this.column.min;
      return !this.column.nullable ? true : null;
  }

  get min(): number | null {
      const val = this.idColumn.min;
      return this.idColumn.columnType === ColumnType.NUMBER && val && val > 0 ? val : null;
  }

  ngOnInit() {
      this.group = this.itemConfig.group;
      this.column = this.itemConfig.parentColumn;
      if (!this.column && this.itemConfig.field) {
        this.column = this.itemConfig.field.metadata;
      }
      this.pageMetamodel = this.column.metamodel;
      this.isChildBuilder = this.builder.isChild();

      this.collect = this.builder.ready().subscribe(isReady => {
          this.config = this.builder.config;
          this.collect = this.builder.metamodel().subscribe((pmd: PageMetamodel) => {
              this.parentMetamodel = pmd;
              this.pageRelation = this.column.relation;
              this.pageMetamodel = this.pageRelation.metamodel;

              this.key = this.pageMetamodel.key;
              if (this.key) {
                  this.idItemConfig = this.itemConfig.items.find(ic => ic.field.metadata.name === this.key);
                  if (this.idItemConfig) {
                      this.idField = this.idItemConfig.field;
                  }
                  if (this.idField) {
                      this.idColumn = this.idField.metadata;
                  }
              }

              this.descColumnName = this.pageRelation.descriptionColumnName;
              if (this.descColumnName) {
                  this.descItemConfig = this.itemConfig.items.find(ic => ic.field.metadata.name === this.descColumnName);
                  if (this.descItemConfig) {
                      this.descField = this.descItemConfig.field;
                  }
                  if (this.descField) {
                      this.descColumn = this.descField.metadata;
                  }
              }

              if (this.builder.isChild()) {
                const dataBuilder = this.getBuilderOf(this.pageMetamodel.qualifier);
                if (dataBuilder) {
                    const isOwnData = this.pageMetamodel.qualifier === dataBuilder.qualifier;
                    this.collect = dataBuilder
                        .data()
                        .subscribe(parentData => {
                            this.setAssociationValue(parentData, isOwnData);
                        });
                }
              }
          });
          this.ready = isReady;
      });
  }

  private getBuilderOf(qualifier: string): PageManager<any> {
        if (this.mode !== EditorMode.CREATE) {
            return this.builder;
        }
        let builder = this.builder;
        while (null != builder) {
            if (builder.qualifier === qualifier) {
                return builder;
            }
            builder = builder.parent();
        }
        return null;
  }

  public hasValue(): boolean {
      return this.control.value && this.control.value > 0;
  }

  public clearValue(): void {
      const existingVal = this.group.value;
      if (existingVal) {
          Object.keys(existingVal).forEach(key => {
              const item = this.itemConfig.items.find(ic => ic.field.metadata.name === key);
              if (item && item.field && item.field.metadata) {
                  const colType = item.field.metadata.columnType;
                  if (colType === ColumnType.NUMBER || colType === ColumnType.DOUBLE) {
                      existingVal[key] = 0;
                  } else if (colType === ColumnType.STRING || colType === ColumnType.DATE) {
                      existingVal[key] = '';
                  }
              }
          });
          this.group.patchValue(existingVal);
      }
  }

  private setAssociationValue(val: any, isOwnerData: boolean) {
      if (this.mode === EditorMode.VIEW) {
          return;
      }
      // this.group.reset();
      if (val) {
          const data = isOwnerData ? val : val[this.column.name];
          if (data) {
            this.group.patchValue(data);
          }
      }
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.associationBuilder) {
          this.associationBuilder.destroy();
          this.associationBuilder = undefined;
      }
  }

  private createAssociationBuilder(): PageManager<any> {
      if (this.associationBuilder && !this.associationBuilder.isDestroyed()) {
          return this.associationBuilder;
      }
      this.associationBuilder = this.builder
          .createInstanceFor(this.pageMetamodel.qualifier, this.builder.parent())
          .withMetamodelConfiguration(cmd => this.configurePopupMetamodel(cmd))
          .withPageConfiguration(config => this.configurePopupConfig(config))
          .withRelationConfiguration(relation => this.configurePopupRelation(relation))
          .withDefaultQuery(query => this.configurePopupQuery(query))
          .withViewer(PageViewMode.NONE);
      return this.associationBuilder;
  }

  public openRelationPopup(): void {
      if (this.isChild) {
          return;
      }
      const assocBuilder = this.createAssociationBuilder();
      const theme = this.config ? this.config.pageTheme : undefined;
      const title = assocBuilder.config ? assocBuilder.config.pageTitle : null;
      const i18n = title ? true : false;
      const ref = this.builder.openDynamicPage(assocBuilder, theme, title, i18n);
      const sub = assocBuilder.onExit().subscribe(data => {
          ref.close(data);
      });

      this.collect = ref.afterClosed$.subscribe(result => {
          if (sub) {
              sub.unsubscribe();
          }
          this.setAssociationValue(result ? result.data : undefined, true);
      });
  }

  private configurePopupRelation(relation: PageRelation): PageRelation {
      let rel = this.parentMetamodel.getRelation(relation.group);
      if (!rel) {
          rel = this.pageMetamodel.getRelation(relation.group);
      }
      if (rel) {
          relation.accessPath = rel.accessPath;
          relation.descriptionColumnName = rel.descriptionColumnName;
      }
      return relation;
  }

  private configurePopupConfig(config: PageConfig<any>): PageConfig<any> {
      config.builderType = BuilderType.ASSOCIATION;
      if (this.config) {
          config.pageTheme = this.config.pageTheme;
      }
      config.pageType = PageType.POPUP;
      config.itemsPerPage = 50;
      config.canCreate = false;
      config.canEdit = false;
      config.canDelete = false;
      config.showPageActions = false;
      if (this.pageMetamodel && this.parentMetamodel) {
          const rel = this.parentMetamodel.getRelation(this.pageMetamodel.group);
          if (rel) {
              config.pageRelation = rel;
          }
      }

      return config;
  }

  private configurePopupMetamodel(cmd: ColumnMetadata): void {
      if (!this.pageRelation.popupColumns) {
          if (cmd.name === this.pageRelation.descriptionColumnName) {
              cmd.showWhenGrid = true;
              cmd.showWhenCompact = true;
          }
          if (cmd.idColumn && cmd.qualifier === this.pageRelation.qualifier) {
              cmd.showWhenGrid = true;
              cmd.showWhenCompact = true;
          }
          return;
      }
      if (cmd.qualifier === this.pageRelation.qualifier) {
          cmd.showWhenGrid = this.pageRelation.popupColumns.includes(cmd.name);
          cmd.showWhenCompact = this.pageRelation.popupColumns.includes(cmd.name);
      }
      cmd.order = this.pageRelation.popupColumns.indexOf(cmd.path);
      cmd.order = cmd.order < 0 ? 1000 : cmd.order;
  }

  private configurePopupQuery(query: CriteriaBuilder<any>): void {
      const idControl = this.group.get(this.idColumn.name);
      const idVal = idControl ? idControl.value : undefined;
      if (idVal !== undefined && idVal !== 0) {
          query
              .withCondition(Condition.AND)
              .addPredicate(this.idColumn.path, Operator.EQ, '')
              .readonly()
              .withValue(idVal);
      }
  }
}

