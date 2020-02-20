import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter, Optional } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { BasePortal } from '../../model/base-portal';
import { Theme } from '../../model/theme.enum';
import { PageManager } from '../../model/page-manager';
import { EditorMode } from '../../model/editor-mode.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GenericDynamicAction, ActionScope, DynamicActionBuilder, ActionType } from '../../model/dynamic-action';
import { RelationPageManager } from '../../model/relation-page-manager';
import { FormItemConfig } from './model/form-item-config';
import { ColumnMetadata } from '../../model/column-metadata';
import { PageConfig } from '../../model/page-config';
import { PopoverRef } from '../../model/popover-ref';
import { PageMode } from '../../model/page-mode.enum';
import { RelationType } from '../../model/relation-type.enum';
import { ColumnType } from '../../model/column-type.enum';
import { FormFieldConfig } from './model/form-field-config';
import { DynamicUtil } from '../../model/dynamic-util';
import { PageRelation } from '../../model/page-relation';
import { GridViewMode } from '../../model/grid-view-mode.enum';


export function isAssociated(input: FormControl) {
  const associated = (input.value || input.value === false || input.value > 0) && (('' + input.value).trim().length > 0);
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
  public manager: PageManager<any>;
  @Input()
  get mode() {
      return this.editorMode;
  }
  set mode(val) {
      this.cachedData = undefined;
      this.editorMode = val;
      if (this.editorMode !== EditorMode.CREATE) {
          this.originalMode = this.editorMode;
      }
  }

  @Output()
  pageSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  editorReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  private editorMode: EditorMode;
  public activeChildManager: PageManager<any>;

  private formReadySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private registeredActions: Array<GenericDynamicAction<any>> = [];
  private formData: any;
  private cachedData: any;
  private formReady = false;

  private childRelations: Array<RelationPageManager>;
  private originalMode: EditorMode;
  private formSubscription: Subscription;

  ready = false;
  form: FormGroup;
  items: Array<FormItemConfig> = [];
  columns: Array<ColumnMetadata> = [];

  private formOptions: { updateOn?: 'change' | 'blur' | 'submit' };

  public config: PageConfig<any>;

  private readonly MAX_PROCESSING_LEVEL = 2;

  get changes() {
      return this.form.valueChanges;
  }
  get valid() {
      return !this.form.invalid;
  }
  get value() {
      return this.form.getRawValue();
  }

  constructor(private fb: FormBuilder, @Optional() private popoverRef: PopoverRef<{ manager: PageManager<any>; mode: EditorMode }, any>) {
      super();
      this.formOptions = { updateOn: 'blur' };
      this.childRelations = new Array<RelationPageManager>();
      this.initIfPopover();
  }

  private initIfPopover() {
      if (this.popoverRef && this.popoverRef.context) {
          this.manager = this.popoverRef.context.manager;
          this.mode = this.popoverRef.context.mode;
          this.theme = this.popoverRef.config.theme ? this.popoverRef.config.theme : Theme.dark;
      }
  }

  ngOnInit() {
      if (!this.manager) {
          return;
      }
      if (this.formOptions && this.updateOn) {
          this.formOptions.updateOn = this.updateOn;
      }
      this.setupPageConfig(this.manager.config);

      this.collect = this.manager.ready().subscribe(isReady => {
          if (isReady) {
              this.collect = this.manager.columns().subscribe(cols => this.buildForm(cols));
              this.collect = this.manager.data().subscribe(d => this.monitorData(d));
              this.registerActions();
              this.collect = this.manager.relationPages().subscribe(childs => this.setupChildPages(childs));
              this.startFormMonitoring();
              this.collect = this.manager.mode().subscribe(m => this.monitorMode(m));
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
      this.formReady = false;
      if (newMode === EditorMode.CREATE) {
          this.editorMode = newMode;
          this.setFormData(undefined);
          this.buildForm(this.columns);
      } else {
          if (newMode && this.cachedData) {
              this.editorMode = newMode;
              this.buildForm(this.columns);
              this.setFormData(this.cachedData);
          } else {
              this.manager.setPageMode(PageMode.GRID);
          }
      }
      this.setActionStates();
      this.startFormMonitoring();
  }

  private setupChildPages(childs: Array<RelationPageManager>): void {
      this.childRelations = childs;
      this.registerChildRelationActions();
  }

  private setFormData(d: any): void {
      this.formData = d;
      if (this.formReady && this.formData) {
          const ed = this.enhanceFormData(this.formData);
          this.form.patchValue(ed);
          this.patchEmptyAssociations(ed, this.form);
      }
  }

  private enhanceFormData(d: any): any {
      if (!d) {
          return d;
      }
      this.manager.getAssociationColumns().forEach(col => {
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
      this.manager.getAssociationColumns().forEach(col => {
          const val = d[col.name];
          if (val && col.relType === RelationType.INNER && col.columnType === ColumnType.ASSOCIATION && Object.keys(val).length === 0) {
              const associatedControl = form.get(col.name);
              if (associatedControl) {
                  associatedControl.reset();
                  associatedControl.updateValueAndValidity({});
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

  private createItemConfigFor(column: ColumnMetadata, parentColumn: ColumnMetadata, group: FormGroup): FormItemConfig {

    let groups: FormArray = null;
    let hasChilds = false;
    const items = new Array<FormItemConfig>();
    group = group || (new FormGroup({}, this.formOptions));

    if (column && column.columnType === ColumnType.ASSOCIATION) {
        if (column.relType === RelationType.OUTER) {
            groups = this.fb.array([]);
            groups.push(group);
        }
        hasChilds = true;
    }
    return {
        group,
        groups,
        parentColumn,
        field: null,
        items,
        isArray: !!groups,
        hasChilds
    };
  }

  private buildForm(cols: Array<ColumnMetadata>): void {
      this.formReady = false;
      this.items = [];
      if (this.form) {
          this.form.reset();
          // this.removeAllFormFields();
          // this.form.reset();
      }
      this.form = undefined;
      this.columns = cols;

      const topFormItemConfig = this.createItemConfigFor(null, null, null);

      cols.forEach(column => {
          if (column.relType === RelationType.OUTER) {
              // We are not supporting outer joins!
              return;
          }
          if (column.ignorable) {
              // Skip ignorable columns (which are annotated as JsonIgnore)
              return;
          }
          this.buildItem(topFormItemConfig, column);
      });

      this.form = topFormItemConfig.group;
      this.items = topFormItemConfig.items;

      this.formReady = true;
      this.formReadySubject.next(this.formReady);
      this.ready = true;
      if (this.manager) {
          this.manager.setForm(this.form);
      }
      Promise.resolve(true).then(() => this.editorReady.emit(this.formReady));
  }

  buildItem(parentItemConfig: FormItemConfig, column: ColumnMetadata) {
    if (column.columnType === ColumnType.ASSOCIATION) {
        if (!column.metamodel || column.metamodel.level > this.MAX_PROCESSING_LEVEL) {
            return;
        }
    }

    if (column.ignorable) {
        // Skip ignorable columns (which are annotated as JsonIgnore)
        return;
    }

    if (column.relType === RelationType.OUTER) {
        // Skip OuterJoins. Currently we do not support FormArray
        return;
    }

    const parentColumn = parentItemConfig.field ? parentItemConfig.field.metadata : null;
    const fieldConfig = this.buildField(column, parentColumn);

    if (column.columnType === ColumnType.ASSOCIATION) {
        if (column.metamodel) {

            const currentItemConfig: FormItemConfig = this.createItemConfigFor(column, parentColumn, null);
            currentItemConfig.field = fieldConfig;

            if (column.relType === RelationType.INNER) {
                const cols = column.metamodel.getColumns();
                cols.forEach(col => {
                    this.buildItem(currentItemConfig, col);
                });

                parentItemConfig.items.push(currentItemConfig);
                parentItemConfig.group.addControl(column.name, currentItemConfig.group);
            } else {
                const cols = column.metamodel.getColumns();
                cols.forEach(col => {
                    this.buildItem(currentItemConfig, col);
                });
                // Skip OuterJoins now
                // parentItemConfig.items.push(currentItemConfig);
                // parentItemConfig.group.addControl(column.name, currentItemConfig.groups);
            }
        }
    } else {
        const currentItemConfig: FormItemConfig = this.createItemConfigFor(column, parentColumn, parentItemConfig.group);
        currentItemConfig.field = fieldConfig;
        parentItemConfig.items.push(currentItemConfig);

        const control = this.createControl(fieldConfig);
        parentItemConfig.group.addControl(column.name, control);
    }
    return parentItemConfig;
}

  createControl(field: FormFieldConfig): FormControl {
      const { disabled, validation, value } = field;
      return this.fb.control({ disabled, value }, validation);
  }

  private buildField(cmd: ColumnMetadata, parentColumn: ColumnMetadata): FormFieldConfig {
      const field: FormFieldConfig = {
          metadata: cmd,
          disabled: this.isDisabled(cmd),
          placeholder: '',
          type: this.convertToInputType(cmd),
          validation: this.setValidators(cmd, parentColumn),
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

  private isRequired(cmd: ColumnMetadata, parentColumn: ColumnMetadata): boolean {
    return parentColumn ? !parentColumn.nullable : !cmd.nullable;
  }

  private setValidators(cmd: ColumnMetadata, parentColumn: ColumnMetadata): Array<ValidatorFn> {
      const validators: Array<ValidatorFn> = new Array<ValidatorFn>();
      if (this.mode === EditorMode.VIEW) {
          return validators;
      }
      if (this.isRequired(cmd, parentColumn)) {
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
      if (cmd.min && cmd.min > 0) {
          validators.push(Validators.min(cmd.min));
      }
      if (cmd.max && cmd.max > 0 && cmd.max < 999999999999999999) {
          validators.push(Validators.max(cmd.max));
      }
      return validators;
  }

  private registerAction(action: GenericDynamicAction<any>): boolean {
      if (this.manager.registerAction(action)) {
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
      this.manager.notify(err.error);
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
                  this.collect = this.manager.create(this.value, err => this.handleActionError(comp, 'create', err)).subscribe(
                      result => {
                          this.setFormData(result);
                          this.manager.setPageMode(PageMode.GRID);
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
                  this.collect = this.manager.update(this.value, err => this.handleActionError(comp, 'update', err)).subscribe(
                      result => {
                          this.setFormData(Object.assign(this.formData ? this.formData : {}, result));
                          this.manager.setPageMode(PageMode.GRID);
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
                  this.collect = this.manager.delete(this.value, err => this.handleActionError(comp, 'delete', err)).subscribe(
                      deleted => {
                          if (deleted) {
                              this.editorMode = EditorMode.VIEW;
                              this.manager.setPageMode(PageMode.GRID);
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
        if (action.id === 'editor.create') {
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
      if (!this.childRelations || this.childRelations.length <= 0) {
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

      this.childRelations.forEach(cb => {
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
          : 'dynamic.page.' + (appName ? appName + relation.qualifier : relation.qualifier);
      return label;
  }

  private uncapitalizeFirstLetter(txt: string): string {
      return txt ? txt.charAt(0).toLowerCase() + txt.slice(1) : txt;
  }

  private activateRelatedPage(cb: RelationPageManager): void {
      if (cb) {
          this.originalMode = this.mode;
          this.editorMode = EditorMode.CHILD;
          this.activeChildManager = cb.build();
          this.manager.setGridViewMode(GridViewMode.MINIMIZED);
      } else {
          this.editorMode = this.originalMode;
          this.activeChildManager = undefined;
          this.manager.setActiveManager(this.manager);
          this.manager.setGridViewMode(GridViewMode.COMPACT);
      }

      this.setActionStates();
  }

  ngOnDestroy() {
      this.registeredActions.forEach(a => this.manager.unregisterAction(a));
      if (this.registeredActions) {
          this.registeredActions.forEach(a => a.destroy());
          this.registeredActions = undefined;
      }
      this.stopFormMonitoring();
      this.activeChildManager = undefined;
      if (this.manager) {
          this.manager.setForm(undefined);
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
      this.pageSubmit.emit(this.value);
  }

  setValue(name: string, value: any) {
      this.form.controls[name].setValue(value, { emitEvent: true });
  }
}

