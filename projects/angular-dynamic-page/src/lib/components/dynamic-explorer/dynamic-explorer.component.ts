import { Component, OnInit, OnDestroy, Input, TemplateRef, Injector } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { Theme } from '../../model/theme.enum';
import { GenericDynamicAction, DynamicAction, DynamicActionBuilder, ActionType, ActionScope } from '../../model/dynamic-action';
import { DynamicUtil } from '../../model/dynamic-util';
import { ComponentType, PortalInjector } from '@angular/cdk/portal';
import { ElementContext } from './model/element-context';
import { EditorEvent } from './model/editor-event';
import { EditorAction } from './model/editor-action.enum';
import { IDynamicElement } from './model/dynamic-element';
import { NavigationAction } from './model/navigation-action.enum';
import { NavigationEvent } from './model/navigation-event';
import { IDynamicElementContent, ElementView } from './model/dynamic-element-content';
import { BaseElementViewComponent } from './base-element-view/base-element-view.component';
import { Subscription } from 'rxjs';
import { IDynamicExplorerManager } from './model/dynamic-explorer-manager';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'zee-dynamic-explorer',
  templateUrl: './dynamic-explorer.component.html',
  styleUrls: ['./dynamic-explorer.component.scss']
})
export class DynamicExplorerComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  theme: Theme;
  @Input()
  manager: IDynamicExplorerManager<any>;
  @Input()
  set element(val: IDynamicElement<any>) {
      this.editorElement = val;
      this.isRoot = false;
      this.inspectViewType();
  }
  get element(): IDynamicElement<any> {
      return this.editorElement;
  }

  private editorElement: IDynamicElement<any>;
  private action: GenericDynamicAction<any>;
  private editorActionNames: Array<string | number>;
  private navigationActionNames: Array<string | number>;
  private navigationActions: Array<GenericDynamicAction<any>>;

  private childElements: Array<IDynamicElement<any>>;
  private isRoot: boolean;
  private rootNodeSubscription: Subscription;

  public renderAs: 'template' | 'component' | 'text' = 'component';

  get uniqueId(): string {
      return this.editorElement ? this.editorElement.uniqueId : null;
  }

  get editable(): boolean {
      return this.manager ? this.manager.isEditable() : false;
  }

  get navigationEnabled(): boolean {
      return this.active && this.manager ? this.manager.isNavigationEnabled() : false;
  }

  get active(): boolean {
      return this.manager ? this.manager.isSelected(this.editorElement) : false;
  }

  get navigationTheme(): string {
      return this.navigationEnabled ? this.selectionTheme : 'd-none';
  }

  get actionTheme(): string {
      return this.active ? this.selectionTheme : 'd-none';
  }

  get selectionTheme(): string {
      return this.active ? ' font-weight-bold border-bottom border-light bg-light' : 'border-bottom border-ligh';
  }

  get explorerIcon(): string {
      return this.expanded ? 'angle-down' : 'angle-right';
  }

  get explorerIconTheme(): string {
      return 'pr-2 explorer-icon-container ' + DynamicUtil.textThemeFor(this.theme);
  }

  get editorAction(): DynamicAction<any> {
      return this.editable ? this.action : null;
  }

  get expanded(): boolean {
      return this.editorElement ? this.editorElement.isExpanded() : false;
  }

  get showChildren(): boolean {
      return this.hasChildren && this.expanded;
  }

  get hasChildren(): boolean {
      return this.children && this.children.length > 0;
  }

  get parentElement(): IDynamicElement<any> {
      return this.editorElement ? this.editorElement.parent : null;
  }

  get children(): IDynamicElement<any>[] {
      return this.childElements;
  }

  get view(): ElementView {
      return this.element ? this.element.view : null;
  }

  get content(): IDynamicElementContent<any> {
      return this.element ? this.element.content : null;
  }

  get textView(): string {
      if (this.renderAs === 'text') {
          return this.view as string;
      }
      return '';
  }

  get templateView(): TemplateRef<any> {
      if (this.renderAs === 'template') {
          return this.view as TemplateRef<any>;
      }
      return null;
  }

  get viewContext(): any {
      return this.element ? this.element.viewContext : { $implicit: {} };
  }

  get componentView(): ComponentType<any> {
      if (this.renderAs === 'component') {
          if (!this.view) {
              return BaseElementViewComponent;
          }
          return this.view as ComponentType<any>;
      }
      return null;
  }

  get type(): string {
      return this.element ? '' + this.element.type : null;
  }

  get id(): string {
      return this.element ? '' + this.element.id : null;
  }

  get icon(): string {
      return this.element ? this.element.icon : null;
  }

  get iconTheme(): string {
      return DynamicUtil.textThemeFor(this.active ? Theme.dark : this.theme);
  }

  get actions(): Array<DynamicAction<IDynamicElementContent<any>>> {
      return this.element ? this.element.actions : null;
  }

  get navigations(): Array<DynamicAction<IDynamicElementContent<any>>> {
      return this.navigationActions;
  }

  constructor(private injector: Injector, private translateService: TranslateService) {
      super();
      this.isRoot = true;
      this.theme = Theme.dark;
      this.editorActionNames = DynamicUtil.getEnumValues(EditorAction);
      this.navigationActionNames = DynamicUtil.getEnumValues(NavigationAction);
      this.navigationActions = Array<GenericDynamicAction<any>>();
  }

  ngOnInit() {
      if (this.isRoot) {
          this.rootNodeSubscription = this.manager.currentTop.subscribe(current => {
              this.editorElement = current;
              this.reset();
              this.resetActions();
              this.init();
          });
      } else {
          this.init();
      }
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.rootNodeSubscription) {
          this.rootNodeSubscription.unsubscribe();
          this.rootNodeSubscription = undefined;
      }
      if (this.action) {
          this.action.destroy();
          this.action = undefined;
      }
      if (this.navigationActions) {
          this.navigationActions.forEach(a => a.destroy());
          this.navigationActions = undefined;
      }
  }

  private resetActions(): void {
      if (this.action) {
          this.action.destroy();
          this.action = undefined;
      }
      if (this.navigationActions) {
          this.navigationActions.forEach(a => a.destroy());
          this.navigationActions = Array<GenericDynamicAction<any>>();
      }
  }

  private init(): void {
      this.createEditorAction();
      this.createNavigationActions();
      this.inspectViewType();
      if (this.editorElement && this.manager) {
          this.collect = this.manager.childsOf(this.uniqueId).subscribe(children => {
              this.childElements = children;
          });
          this.collect = this.manager.selected(this.uniqueId).subscribe(_ => this.expand());
          if (!this.parentElement || this.manager.isSelected(this.element)) {
              this.element.expand();
          }
      }
  }

  public expand(): void {
      if (this.editorElement) {
          this.editorElement.expand();
      }
  }

  public collapse(): void {
      if (this.editorElement) {
          this.editorElement.collapse();
      }
  }

  public toggle(event): void {
      if (event) {
          event.preventDefault();
      }
      if (this.editorElement) {
          this.editorElement.toggle();
      }
  }

  public toggleSelection(event): void {
      if (event) {
          event.preventDefault();
      }
      this.manager.select(this.editorElement);
      if (this.active) {
          this.expand();
      }
  }

  public getElementInjector(): Injector {
      const ctx = this.getElementContext();
      const elementInjector = this.createInjector(ctx);
      return elementInjector;
  }

  private getElementContext<T>(): ElementContext<T> {
      const ctx = new ElementContext<T>(this.element ? this.element.content : null, this.theme);
      return ctx;
  }

  private createInjector(context: ElementContext<any>): Injector {
      const tokens = new WeakMap([[ElementContext, context]]);
      return new PortalInjector(this.injector, tokens);
  }

  private inspectViewType(): void {
      if (!this.element || !this.element.view) {
          this.renderAs = 'component';
      } else if (typeof this.element.view === 'string') {
          this.renderAs = 'text';
      } else if (this.element.view instanceof TemplateRef) {
          this.renderAs = 'template';
      } else {
          this.renderAs = 'component';
      }
  }

  navigate(element: IDynamicElement<any>) {
      // this.manager ? this.manager.navigateTo(element);
  }

  private handleExplorerAction(action: DynamicAction<any>, payload: any): void {
      if (!this.manager) {
          return;
      }
      if (action && `${action.id}`.includes(`${EditorAction.CREATE_CHILD}.${payload}`)) {
          this.manager.emit(new EditorEvent(EditorAction.CREATE_CHILD, this.element, payload));
      } else if (payload === EditorAction.CREATE) {
          this.manager.emit(new EditorEvent(EditorAction.CREATE, this.element));
      } else if (payload === EditorAction.EDIT) {
          this.manager.emit(new EditorEvent(EditorAction.EDIT, this.element));
      } else if (payload === EditorAction.DELETE) {
          this.manager.emit(new EditorEvent(EditorAction.DELETE, this.element));
      } else if (payload === NavigationAction.SELF) {
          this.manager.navigate(new NavigationEvent(NavigationAction.SELF, this.element));
      } else if (payload === NavigationAction.UP) {
          this.manager.navigate(new NavigationEvent(NavigationAction.UP, this.element));
      } else if (payload === NavigationAction.TOP) {
          this.manager.navigate(new NavigationEvent(NavigationAction.TOP, this.element));
      }
  }

  private canNavigate(id: string | number): boolean {
      if (!this.element.parent) {
          return false;
      }
      if (!this.manager.isCurrentTop(this.element) || this.element === this.manager.root) {
          if (id === NavigationAction.TOP || id === NavigationAction.UP) {
              return false;
          }
      }
      if (this.manager.isCurrentTop(this.element)) {
          if (id === NavigationAction.SELF) {
              return false;
          }
      }
      if (this.manager.isCurrentTop(this.element.parent)) {
          if (id === NavigationAction.UP) {
              return false;
          }
      }
      if (this.element.parent === this.manager.root) {
          if (id === NavigationAction.TOP) {
              return false;
          }
      }
      return true;
  }

  private createNavigationActions(): void {
      if (!this.element) {
          return;
      }
      this.navigationActionNames.forEach(id => {
          if (!this.canNavigate(id)) {
              return;
          }
          const navId = 'explorer.navigation.' + id;
          const navIcon = NavigationAction.UP === id ? 'angle-up' : NavigationAction.TOP === id ? 'angle-double-up' : 'bullseye';
          const act = this.actionOf(navId, '', false, id, false, navIcon);
          this.navigationActions.push(act);
      });
  }

  private createEditorAction(): void {
      if (!this.element) {
          return;
      }
      this.action = this.actionOf('explorer.editor', '', false, null, true);
  }

  private provideChildEditorActions(parent: GenericDynamicAction<any>): Array<GenericDynamicAction<any>> {
      const childs = new Array<GenericDynamicAction<any>>();
      this.editorActionNames.forEach(id => {
          if (id === EditorAction.CREATE) {
              return;
          } else if (id === EditorAction.EDIT || id === EditorAction.DELETE) {
              if (this.element.type === 'ROOT') {
                  return;
              }
          }
          if (id === EditorAction.CREATE_CHILD) {
              if (!this.element) {
                  return;
              }
              const childTypes = this.manager.getChildTypesOf(this.element.type);
              if (childTypes && childTypes.length > 0) {
                  childTypes.forEach(ct => {
                      const actionId = parent.id + '.' + id + '.' + ct.id;
                      const label = parent.id + '.' + id;
                      const childAction = this.actionOf(actionId, label, true, ct.id, false, ct.icon);
                      if (childAction) {
                          childAction.payload = ct.id;
                          if (ct.label) {
                              childAction.badge = ct.i18n ? this.translateService.instant(ct.label) : ct.label;
                          }
                          childs.push(childAction);
                      }
                  });
              }
          } else {
              const actionId = parent.id + '.' + id;
              const label = parent.id + '.' + id;
              const ca = this.actionOf(actionId, label, true, actionId, false);
              if (ca) {
                  ca.payload = id;
                  childs.push(ca);
              }
          }
      });
      if (childs && childs.length > 0) {
          parent.buttonType = 'split';
      }
      return childs;
  }

  private actionOf(
      id: string | number,
      label: string,
      i18n: boolean,
      payload?: string | number,
      createChilds = false,
      icon?: string
  ): GenericDynamicAction<any> {
      const btnIcon = icon ? icon : createChilds ? 'bolt' : 'sync-alt';
      const btnPayload = payload ? payload : id;

      const manager = new DynamicActionBuilder<any>(id, ActionType.CUSTOM)
          .withScope(ActionScope.CUSTOM)
          .withLabel(label)
          .withI18n(i18n)
          .withPayload(btnPayload)
          .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
          .withIconClass(btnIcon)
          .withHandler((comp, d) => {
              comp.disabled = true;
              this.handleExplorerAction(comp, d);
              comp.disabled = false;
          });
      if (createChilds) {
          return manager.withChildsProvider(a => this.provideChildEditorActions(a)).build();
      } else {
          return manager.build();
      }
  }
}
