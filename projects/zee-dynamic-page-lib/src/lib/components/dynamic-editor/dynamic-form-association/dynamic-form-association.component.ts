import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { PageBuilder } from '../../../model/page-builder';
import { EditorMode } from '../../../model/editor-mode.enum';
import { FormItemConfig } from '../../../model/form-item-config';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ColumnMetadata } from '../../../model/column-metadata';
import { PageMetamodel } from '../../../model/page-metamodel';
import { PageRelation } from '../../../model/page-relation';
import { FormFieldConfig } from '../../../model/form-field-config';
import { PageConfig } from '../../../model/page-config';
import { ColumnType } from '../../../model/column-type.enum';
import { BuilderType } from '../../../model/builder-type.enum';
import { PageType } from '../../../model/page-type.enum';
import { CriteriaBuilder } from '../../../model/query-builder';
import { Operator } from '../../../model/operator.enum';
import { Condition } from '../../../model/condition.enum';
import { PageViewMode } from '../../../model/page-view-mode.enum';

@Component({
  selector: 'zee-dynamic-form-association',
  templateUrl: './dynamic-form-association.component.html',
  styleUrls: ['./dynamic-form-association.component.scss']
})
export class DynamicFormAssociationComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  builder: PageBuilder<any>;
  @Input()
  mode: EditorMode;
  @Input()
  itemConfig: FormItemConfig;

  group: FormGroup;
  parentColumn: ColumnMetadata;
  parentMetamodel: PageMetamodel;
  pageMetamodel: PageMetamodel;
  pageRelation: PageRelation;

  idColumnName: string;
  idItemConfig: FormItemConfig;
  idField: FormFieldConfig;
  idColumn: ColumnMetadata;

  descColumnName: string;
  descItemConfig: FormItemConfig;
  descField: FormFieldConfig;
  descColumn: ColumnMetadata;

  entities: Array<any>;
  ready = false;
  isChild: boolean;

  private associationBuilder: PageBuilder<any>;
  private config: PageConfig<any>;

  constructor() {
      super();
      this.entities = [];
      this.isChild = false;
  }

  get control(): AbstractControl {
      return this.group.controls[this.idColumn.name];
  }

  get required(): boolean | null {
      const val = this.parentColumn.minValue;
      return !this.parentColumn.nullable ? true : null;
  }

  get minValue(): number | null {
      const val = this.idColumn.minValue;
      return this.idColumn.columnType === ColumnType.NUMBER && val && val > 0 ? val : null;
  }

  ngOnInit() {
      this.group = this.itemConfig.group;
      this.parentColumn = this.itemConfig.parentColumn;
      this.pageMetamodel = this.itemConfig.parentColumn.metamodel;
      this.isChild = this.builder.isChild();

      this.collect = this.builder.ready().subscribe(isReady => {
          this.config = this.builder.config;
          this.collect = this.builder.metamodel().subscribe((pmd: PageMetamodel) => {
              this.parentMetamodel = pmd;
              this.pageRelation = pmd.getRelation(this.itemConfig.parentColumn.metamodel.group);
              this.pageMetamodel = this.pageRelation.metamodel;

              this.idColumnName = this.pageMetamodel.idColumnName;
              if (this.idColumnName) {
                  this.idItemConfig = this.itemConfig.items.find(ic => ic.field.metadata.name === this.idColumnName);
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
                  this.collect = this.builder
                      .parent()
                      .data()
                      .subscribe(parentData => {
                          this.setAssociationValue(parentData);
                      });
              }
              /*
              if (this.pageRelation && this.mode !== EditorMode.VIEW) {
                  this.collect = this.builder.findRelatedEntities(this.pageRelation).subscribe((data) => {
                      this.entities = data;
                  });
              } else if (this.pageRelation && this.mode === EditorMode.VIEW) {

              }
              */
          });
          this.ready = isReady;
      });
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

  private setAssociationValue(val: any) {
      if (this.mode === EditorMode.VIEW) {
          return;
      }
      if (val) {
          this.group.patchValue(val);
      }
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.associationBuilder) {
          this.associationBuilder.destroy();
          this.associationBuilder = undefined;
      }
  }

  private createAssociationBuilder(): PageBuilder<any> {
      if (this.associationBuilder && !this.associationBuilder.isDestroyed()) {
          return this.associationBuilder;
      }
      this.associationBuilder = this.builder
          .createInstanceFor(this.pageMetamodel.qualifier)
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
          this.setAssociationValue(result ? result.data : undefined);
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

