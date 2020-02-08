import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter, Optional } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { BasePortal } from '../../model/base-portal';
import { Theme } from '../../model/theme.enum';
import { PageBuilder } from '../../model/page-builder';
import { EditorMode } from '../../model/editor-mode.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GenericDynamicAction, ActionScope, DynamicActionBuilder, ActionType } from '../../model/dynamic-action';
import { RelationPageBuilder } from '../../model/relation-page-builder';
import { FormItemConfig } from '../../model/form-item-config';
import { ColumnMetadata } from '../../model/column-metadata';
import { PageConfig } from '../../model/page-config';
import { PopoverRef } from '../../model/popover-ref';
import { PageMode } from '../../model/page-mode.enum';
import { RelationType } from '../../model/relation-type.enum';
import { ColumnType } from '../../model/column-type.enum';
import { FormFieldConfig } from '../../model/form-field-config';
import { DynamicUtil } from '../../model/dynamic-util';
import { PageRelation } from '../../model/page-relation';
import { GridViewMode } from '../../model/grid-view-mode.enum';


export function isAssociated(input: FormControl) {
  const associated = input.value && (input.value > 0 || ('' + input.value).trim().length > 0);
  if (!associated) {
      input.markAsDirty();
  }
  return associated ? null : { needsAssociation: true };
}

export function isEnumUnknown(input: FormControl) {
  const isUnknown = !!input.value && input.value === 'UNKNOWN';
  return isUnknown ? { required: true } : null;
}

@Component({
  selector: 'zee-dynamic-editor',
  templateUrl: './dynamic-editor.component.html',
  styleUrls: ['./dynamic-editor.component.scss']
})
export class DynamicEditorComponent extends BasePortal implements OnChanges, OnInit, OnDestroy {
  @Input()
  theme: Theme = Theme.dark;
  @Input()
  updateOn: 'change' | 'blur' | 'submit';
  @Input()
  public builder: PageBuilder<any>;
  @Input()
  get mode() {
      return this._mode;
  }
  set mode(val) {
      this.cachedData = undefined;
      this._mode = val;
      if (this._mode !== EditorMode.CREATE) {
          this.originalMode = this._mode;
      }
  }

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  editorReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _mode: EditorMode;
  public activeChildBuilder: PageBuilder<any>;

  private formReadySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private registeredActions: Array<GenericDynamicAction<any>> = [];
  private formData: any;
  private cachedData: any;
  private _formReady = false;

  private childBuilders: Array<RelationPageBuilder>;
  private originalMode: EditorMode;
  private formSubscription: Subscription;

  ready = false;
  form: FormGroup;
  items: Array<FormItemConfig> = [];
  columns: Array<ColumnMetadata> = [];

  private formOptions: { updateOn?: 'change' | 'blur' | 'submit' };

  public config: PageConfig<any>;

  get changes() {
      return this.form.valueChanges;
  }
  get valid() {
      return !this.form.invalid;
  }
  get value() {
      return this.form.getRawValue();
  }

  constructor(private fb: FormBuilder, @Optional() private popoverRef: PopoverRef<{ builder: PageBuilder<any>; mode: EditorMode }, any>) {
      super();
      this.formOptions = { updateOn: 'blur' };
      this.childBuilders = new Array<RelationPageBuilder>();
      this.initIfPopover();
  }

  private initIfPopover() {
      if (this.popoverRef && this.popoverRef.context) {
          this.builder = this.popoverRef.context.builder;
          this.mode = this.popoverRef.context.mode;
          this.theme = this.popoverRef.config.theme ? this.popoverRef.config.theme : Theme.dark;
      }
  }

  ngOnInit() {
      if (!this.builder) {
          return;
      }
      if (this.formOptions && this.updateOn) {
          this.formOptions.updateOn = this.updateOn;
      }
      this.setupPageConfig(this.builder.config);

      this.collect = this.builder.ready().subscribe(isReady => {
          if (isReady) {
              this.collect = this.builder.columns().subscribe(cols => this.buildForm(cols));
              this.collect = this.builder.data().subscribe(d => this.monitorData(d));
              this.registerActions();
              this.collect = this.builder.relationPages().subscribe(childs => this.setupChildPages(childs));
              this.startFormMonitoring();
              this.collect = this.builder.mode().subscribe(m => this.monitorMode(m));
          }
          this.collect = this.formReadySubject.subscribe(formReady => this.setFormData(this.formData));
      });
  }

  private setupPageConfig(config: PageConfig<any>): void {
      this.config = config;
      if (this.config && this.config.formUpdateOnMode) {
          this.formOptions.updateOn = this.config.formUpdateOnMode;
      }
  }

  private monitorMode(mode: PageMode): void {
      this.setActionStates();
  }

  private monitorData(data: any): void {
      this.cachedData = data;
      if (this.mode !== EditorMode.CREATE) {
          this.setFormData(data);
      }
  }

  private stopFormMonitoring(): void {
      if (this.formSubscription) {
          this.formSubscription.unsubscribe();
          this.formSubscription = undefined;
      }
  }

  private startFormMonitoring(): void {
      if (this.form) {
          this.stopFormMonitoring();
          this.collect = this.formSubscription = this.form.statusChanges.subscribe(s => this.setActionStates());
      }
  }

  private changeMode(newMode: EditorMode): void {
      this.stopFormMonitoring();
      this._formReady = false;
      if (newMode === EditorMode.CREATE) {
          this._mode = newMode;
          this.setFormData(undefined);
          this.buildForm(this.columns);
      } else {
          if (newMode && this.cachedData) {
              this._mode = newMode;
              this.buildForm(this.columns);
              this.setFormData(this.cachedData);
          } else {
              this.builder.setPageMode(PageMode.GRID);
          }
      }
      this.setActionStates();
      this.startFormMonitoring();
  }

  private setupChildPages(childs: Array<RelationPageBuilder>): void {
      this.childBuilders = childs;
      this.registerChildRelationActions();
  }

  private setFormData(d: any): void {
      this.formData = d;
      if (this._formReady && this.formData) {
          const ed = this.enhanceFormData(this.formData);
          this.form.patchValue(ed);
          this.patchEmptyAssociations(ed, this.form);
      }
  }

  private enhanceFormData(d: any): any {
      if (!d) {
          return d;
      }
      this.builder.getAssociationColumns().forEach(col => {
          if (col.relType === RelationType.INNER) {
              const val = d[col.name];
              if (null === val || undefined === val) {
                  d[col.name] = {};
              } else if (col.columnType === ColumnType.ASSOCIATION && Object.keys(val).length === 0) {
                  d[col.name] = {};
              }
          }
      });
      return d;
  }

  private patchEmptyAssociations(d: any, form: FormGroup): void {
      if (!d || !form) {
          return d;
      }
      this.builder.getAssociationColumns().forEach(col => {
          const val = d[col.name];
          if (val && col.relType === RelationType.INNER && col.columnType === ColumnType.ASSOCIATION && Object.keys(val).length === 0) {
              const associatedControl = form.get(col.name);
              if (associatedControl) {
                  associatedControl.reset();
              }
          }
      });
  }

  private removeAllFormFields(): void {
      if (!this.form) {
          return;
      }
      Object.keys(this.form.controls).forEach(key => {
          this.form.removeControl(key);
      });
  }

  private buildForm(cols: Array<ColumnMetadata>): void {
      this._formReady = false;
      this.items = [];
      if (this.form) {
          this.form.reset();
          this.removeAllFormFields();
          this.form.reset();
      }
      this.form = undefined;
      this.columns = cols;
      const form = new FormGroup({}, this.formOptions);
      cols.forEach(column => {
          if (column.relType === RelationType.OUTER) {
              // We are not supporting outer joins!
              return;
          }
          if (column.ignorable) {
              // Skip ignorable columns (which are annotated as JsonIgnore)
              return;
          }
          this.buildItem(form, null, column);
      });
      this.form = form;
      this._formReady = true;
      this.formReadySubject.next(this._formReady);
      this.ready = true;
      if (this.builder) {
          this.builder.setForm(this.form);
      }
      Promise.resolve(true).then(() => this.editorReady.emit(this._formReady));
  }

  buildItem(parent: FormGroup, parentConfig: FormItemConfig, column: ColumnMetadata, parentCol?: ColumnMetadata) {
      if (column.columnType === ColumnType.ASSOCIATION) {
          if (!column.metamodel || column.metamodel.level > 2) {
              return;
          }
      }

      if (column.ignorable) {
          // Skip ignorable columns (which are annotated as JsonIgnore)
          return;
      }

      let itemConfig: FormItemConfig = parentConfig;

      if (!itemConfig) {
          itemConfig = {
              group: parent,
              groups: null,
              parentColumn: parentCol,
              field: null,
              items: null,
              isArray: false,
              hasChilds: false
          };
          this.items.push(itemConfig);
      }

      if (column.columnType === ColumnType.ASSOCIATION) {
          if (column.metamodel && column.metamodel.level < 3) {
              if (column.relType === RelationType.INNER) {
                  itemConfig.group = new FormGroup({}, this.formOptions);
                  itemConfig.hasChilds = true;
                  itemConfig.isArray = false;
                  itemConfig.parentColumn = column;

                  itemConfig.items = new Array<FormItemConfig>();
                  const cols = column.metamodel.getColumns();
                  cols.forEach(col => {
                      this.buildItem(itemConfig.group, itemConfig, col, column);
                  });

                  parent.addControl(column.name, itemConfig.group);
              } else {
                  itemConfig.groups = this.fb.array([]);
                  itemConfig.hasChilds = true;
                  itemConfig.isArray = true;
                  itemConfig.parentColumn = column;
                  // parent.addControl(column.name, itemConfig.groups);

                  itemConfig.items = new Array<FormItemConfig>();
                  column.metamodel.getColumns();
              }
          }
      } else {
          const fieldConfig = this.buildField(column, itemConfig);
          if (itemConfig.items) {
              const childItemConfig = {
                  group: itemConfig.group,
                  groups: itemConfig.groups,
                  parentColumn: parentCol,
                  field: fieldConfig,
                  items: null,
                  isArray: false,
                  hasChilds: false
              };
              itemConfig.items.push(childItemConfig);
          } else {
              itemConfig.field = fieldConfig;
          }
          const control = this.createControl(fieldConfig);
          parent.addControl(column.name, control);
      }
      return itemConfig;
  }

  createControl(field: FormFieldConfig): FormControl {
      const { disabled, validation, value } = field;
      return this.fb.control({ disabled, value }, validation);
  }

  private buildField(cmd: ColumnMetadata, itemConfig: FormItemConfig): FormFieldConfig {
      const field: FormFieldConfig = {
          metadata: cmd,
          disabled: this.isDisabled(cmd),
          placeholder: '',
          type: this.convertToInputType(cmd),
          validation: this.setValidators(cmd, itemConfig),
          value: cmd.defaultValue
      };
      return field;
  }

  private isDisabled(cmd: ColumnMetadata): boolean {
      if (this.mode === EditorMode.VIEW) {
          return true;
      }
      if (cmd.relType === RelationType.INNER) {
          return false; // (cmd.idColumn && !cmd.nullable) ? false : true;
      } else {
          return cmd.idColumn || !cmd.editable ? true : false;
      }
  }

  private convertToInputType(cmd: ColumnMetadata): string {
      const colType = cmd.columnType;
      let inputType: string;
      switch (colType) {
          case ColumnType.ENUM: {
              if (this.mode === EditorMode.CREATE && !cmd.editable) {
                  inputType = 'input';
              } else {
                  inputType = 'select';
              }
              break;
          }
          case ColumnType.DATE:
          case ColumnType.DOUBLE:
          case ColumnType.NUMBER:
          case ColumnType.STRING: {
              inputType = 'input';
              break;
          }
          default: {
              inputType = 'input';
              break;
          }
      }
      return inputType;
  }

  private isRequired(cmd: ColumnMetadata, itemConfig: FormItemConfig): boolean {
      if (!cmd.nullable) {
          if (cmd.relType === RelationType.INNER) {
              if (cmd.idColumn && itemConfig && itemConfig.parentColumn) {
                  return !itemConfig.parentColumn.nullable;
              }
          }
      }
      return !cmd.nullable;
  }

  private setValidators(cmd: ColumnMetadata, itemConfig: FormItemConfig): Array<ValidatorFn> {
      const validators: Array<ValidatorFn> = new Array<ValidatorFn>();
      if (this.mode === EditorMode.VIEW) {
          return validators;
      }
      if (this.isRequired(cmd, itemConfig)) {
          validators.push(Validators.required);
          if (cmd.columnType === ColumnType.ENUM) {
              validators.push(isEnumUnknown);
          }
          if (cmd.relType === RelationType.INNER) {
              validators.push(isAssociated);
          }
      }
      if (cmd.minLength && cmd.minLength > 0) {
          validators.push(Validators.minLength(cmd.minLength));
      }
      if (cmd.maxLength && cmd.maxLength > 0 && cmd.maxLength < 9999999) {
          validators.push(Validators.maxLength(cmd.maxLength));
      }
      if (cmd.minValue && cmd.minValue > 0) {
          validators.push(Validators.min(cmd.minValue));
      }
      if (cmd.maxValue && cmd.maxValue > 0 && cmd.maxValue < 999999999999999999) {
          validators.push(Validators.max(cmd.maxValue));
      }
      return validators;
  }

  private registerAction(action: GenericDynamicAction<any>): boolean {
      if (this.builder.registerAction(action)) {
          this.registeredActions.push(action);
          return true;
      }
      return false;
  }

  private getCurrentActionScope(): ActionScope {
      if (this.mode === EditorMode.CREATE) {
          return ActionScope.EDITOR;
      } else if (this.mode === EditorMode.EDIT) {
          return ActionScope.EDITOR;
      } else if (this.mode === EditorMode.VIEW) {
          return ActionScope.VIEW;
      }
  }

  private handleActionError(comp: GenericDynamicAction<any>, type: 'create' | 'update' | 'delete', err: any): void {
      comp.disabled = false;
      this.setActionStates();
      this.builder.notify(err.error);
  }

  private registerActions(): void {
      let action: GenericDynamicAction<any> = null;
      if (this.config.canCreate && this.mode !== EditorMode.VIEW) {
          action = new DynamicActionBuilder<any>('editor.create.cancel', ActionType.CANCEL)
              .withScope(this.getCurrentActionScope())
              .withLabel('dynamic.action.cancel')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('arrow-left')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.changeMode(this.originalMode);
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);

          action = new DynamicActionBuilder<any>('editor.create', ActionType.CUSTOM)
              .withScope(this.getCurrentActionScope())
              .withLabel('dynamic.action.create')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('plus')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.changeMode(EditorMode.CREATE);
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);

          action = new DynamicActionBuilder<any>('editor.save', ActionType.CREATE)
              .withScope(this.getCurrentActionScope(), ActionScope.DIALOG)
              .withLabel('dynamic.action.save')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('save')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.collect = this.builder.create(this.value, err => this.handleActionError(comp, 'create', err)).subscribe(
                      result => {
                          this.setFormData(result);
                          this.builder.setPageMode(PageMode.GRID);
                      },
                      err => {},
                      () => this.setActionStates()
                  );
              })
              .build();
          this.registerAction(action);
      }

      if (this.config.canEdit && this.mode !== EditorMode.VIEW) {
          action = new DynamicActionBuilder<any>('editor.update', ActionType.UPDATE)
              .withScope(this.getCurrentActionScope(), ActionScope.DIALOG)
              .withLabel('dynamic.action.save')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('edit')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.collect = this.builder.update(this.value, err => this.handleActionError(comp, 'update', err)).subscribe(
                      result => {
                          this.setFormData(Object.assign(this.formData ? this.formData : {}, result));
                          this.builder.setPageMode(PageMode.GRID);
                      },
                      err => {},
                      () => this.setActionStates()
                  );
              })
              .build();
          this.registerAction(action);
      }

      if (this.config.canDelete && this.mode !== EditorMode.VIEW) {
          action = new DynamicActionBuilder<any>('editor.delete', ActionType.DELETE)
              .withScope(this.getCurrentActionScope(), ActionScope.DIALOG)
              .withLabel('dynamic.action.delete')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('trash-alt')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.collect = this.builder.delete(this.value, err => this.handleActionError(comp, 'delete', err)).subscribe(
                      deleted => {
                          if (deleted) {
                              this._mode = EditorMode.VIEW;
                              this.builder.setPageMode(PageMode.GRID);
                          }
                          this.setActionStates();
                      },
                      err => {},
                      () => this.setActionStates()
                  );
              })
              .build();
          this.registerAction(action);
      }
      this.setActionStates();
  }

  private setActionStates(): void {
      Promise.resolve(null).then(() => this.setActionStatesInternal());
  }

  private setActionStatesInternal(): void {
      if (!this.registeredActions) {
          return;
      }
      this.registeredActions.forEach(a => {
          if (!this.form || !this.value) {
              a.visible = false;
              a.disabled = true;
              return;
          }
          a.disabled = this.isDisabledAction(a);
          a.visible = this.isVisibleAction(a);
      });
  }

  private isDisabledAction(action: GenericDynamicAction<any>): boolean {
      if (action.id === 'editor.create.cancel') {
          return false;
      }
      return !this.valid;
  }

  private isVisibleAction(action: GenericDynamicAction<any>): boolean {
      if (this.mode === EditorMode.CHILD) {
          if (action.id === 'editor.create.cancel') {
              return false;
          }
          return action.containsScope(ActionScope.RELATION) || action.type === ActionType.CANCEL;
      } else {
          if (action.containsScope(ActionScope.RELATION)) {
              return false;
          } else if (action.id === 'editor.create' && this.mode === EditorMode.CREATE) {
              return false;
          }

          if (action.id === 'editor.create.cancel') {
              return this.mode === EditorMode.CREATE ? true : false;
          }

          if (this.value && this.value.id) {
              return ActionType.CREATE === action.type ? false : true;
          } else {
              return ActionType.CREATE === action.type ? true : false;
          }
      }
  }

  private registerChildRelationActions(): void {
      if (!this.childBuilders || this.childBuilders.length <= 0) {
          return;
      }

      let action: GenericDynamicAction<any> = null;

      action = new DynamicActionBuilder<any>('editor.child.close', ActionType.CANCEL)
          .withScope(ActionScope.RELATION)
          .withLabel('dynamic.action.back')
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass('arrow-left')
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.activateRelatedPage(undefined);
              comp.disabled = false;
          })
          .build();
      this.registerAction(action);

      this.childBuilders.forEach(cb => {
          const actionId = 'editor.child.' + cb.relation.qualifier;
          action = new DynamicActionBuilder<any>(actionId, ActionType.VIEW)
              .withScope(ActionScope.EDITOR)
              .withLabel(this.extractChildRelationLabel(cb.relation))
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('share-alt-square')
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.activateRelatedPage(cb);
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);
      });
  }

  private extractChildRelationLabel(relation: PageRelation): string {
      const appName = this.config.dynamicConfig.i18nAppName;
      const label = relation.pageTitle
          ? relation.pageTitle
          : 'global.menu.entities.' + (appName ? appName + relation.qualifier : this.uncapitalizeFirstLetter(relation.qualifier));
      return label;
  }

  private uncapitalizeFirstLetter(txt: string): string {
      return txt ? txt.charAt(0).toLowerCase() + txt.slice(1) : txt;
  }

  private activateRelatedPage(cb: RelationPageBuilder): void {
      if (cb) {
          this.originalMode = this.mode;
          this._mode = EditorMode.CHILD;
          this.activeChildBuilder = cb.build();
          this.builder.setGridViewMode(GridViewMode.MINIMIZED);
      } else {
          this._mode = this.originalMode;
          this.activeChildBuilder = undefined;
          this.builder.setActiveBuilder(this.builder);
          this.builder.setGridViewMode(GridViewMode.COMPACT);
      }

      this.setActionStates();
  }

  ngOnDestroy() {
      this.registeredActions.forEach(a => this.builder.unregisterAction(a));
      if (this.registeredActions) {
          this.registeredActions.forEach(a => a.destroy());
          this.registeredActions = undefined;
      }
      this.stopFormMonitoring();
      this.activeChildBuilder = undefined;
      if (this.builder) {
          this.builder.setForm(undefined);
      }
      this.detachView();
      super.ngOnDestroy();
  }

  ngOnChanges() {
      /*
      if (this.form) {
          const controls = Object.keys(this.form.controls);
          const configControls = this.controls.map((item) => item.metadata.path);

          controls
              .filter((control) => !configControls.includes(control))
              .forEach((control) => this.form.removeControl(control));

          configControls
              .filter((control) => !controls.includes(control))
              .forEach((name) => {
                  const field = this.fields.find((control) => control.metadata.path === name);
                  this.form.addControl(name, this.createControl(field));
              });
      }
      */
  }

  handleSubmit(event: Event) {
      event.preventDefault();
      event.stopPropagation();
      this.submit.emit(this.value);
  }

  setValue(name: string, value: any) {
      this.form.controls[name].setValue(value, { emitEvent: true });
  }
}

