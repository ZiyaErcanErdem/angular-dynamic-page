import { IDynamicElement, DynamicElement } from './dynamic-element';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { IDynamicElementContent, ElementView, DynamicElementContent } from './dynamic-element-content';
import { IExplorerContentProvider } from './explorer-content-provider';
import { IExplorerDataContext } from './explorer-data-context';
import { IEditorEvent, EditorEvent } from './editor-event';
import { INavigationEvent } from './navigation-event';
import { EditorAction } from './editor-action.enum';
import { NavigationAction } from './navigation-action.enum';
import { DynamicAction } from '../../../model/dynamic-action';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { BaseElementViewComponent } from '../base-element-view/base-element-view.component';

export interface ChildType {
    id: string | number;
    label?: string;
    i18n?: boolean;
    icon?: string;
}

export interface IDynamicExplorerManager<T> {
    label: string;
    root: IDynamicElement<any>;
    currentTop: Observable<IDynamicElement<any>>;
    isCurrentTop(elm: IDynamicElement<any>): boolean;

    withContentProvider(contentProvider: IExplorerContentProvider<T>): IDynamicExplorerManager<T>;
    setEditable(editable: boolean): IDynamicExplorerManager<T>;
    isEditable(): boolean;

    addData(...ctx: IExplorerDataContext<T>[]): IDynamicExplorerManager<T>;
    removeData(...ctx: IExplorerDataContext<T>[]): IDynamicExplorerManager<T>;
    getDataById(id: string | number, type: string | number): T;
    childsDataById(id: string | number, type: string | number): Observable<T[]>;

    addContent(content: IDynamicElementContent<T>, icon?: string, view?: ElementView, viewContext?: any): DynamicElement<T>;
    removeContent(content: IDynamicElementContent<T>): void;
    getContent(uniqueId: string): IDynamicElementContent<T>;
    getContentById(id: string | number, type: string | number): IDynamicElementContent<T>;
    childContentsById(id: string | number, type: string | number): Observable<IDynamicElementContent<any>[]>;
    childContentsOf(uniqueId: string): Observable<IDynamicElementContent<any>[]>;

    addAction(id: string | number, type: string | number, action: DynamicAction<any>): IDynamicExplorerManager<T>;
    addElementAction(uniqueId: string, action: DynamicAction<any>): IDynamicExplorerManager<T>;

    contentSelection(): Observable<IDynamicElementContent<T>>;

    navigateTo(target: IDynamicElement<any>): void;
    navigateById(id: string | number, type: string | number): void;
    isNavigationEnabled(): boolean;

    emit(event: IEditorEvent<T>): void;
    navigate(event: INavigationEvent<any>): void;
    getChildTypesOf(type: string | number): Array<ChildType>;

    add(element: IDynamicElement<T>): void;
    delete(uniqueId: string): void;
    update(uniqueId: string, update: Partial<IDynamicElement<T>>): void;
    childsOf(uniqueId: string): Observable<IDynamicElement<any>[]>;
    get(uniqueId: string): IDynamicElement<any>;
    getElementById(id: string | number, type: string | number): IDynamicElement<T>;
    selectElementById(id: string | number, type: string | number): void;
    // getChildsById(id: string | number, type: string | number): IDynamicElement<T>;

    selected(uniqueId: string): Observable<boolean>;
    isSelected(elm: IDynamicElement<any>): boolean;
    select(elm: IDynamicElement<any>): void;
    deselect(elm: IDynamicElement<any>): void;
    hasSelection(): boolean;
    getSelection(): IDynamicElement<any>;

    notifyContentCreated(type: string | number, data: T): void;
    notifyContentUpdated(type: string | number, data: T): void;
    notifyContentDeleted(type: string | number, data: T): void;

    reset(): void;
    destroy(): void;
}

export class DynamicExplorerManager<T> extends DynamicBaseComponent implements IDynamicExplorerManager<T> {
    private elementsSubject: BehaviorSubject<Array<IDynamicElement<T>>>;
    private elementsMap: Map<string, IDynamicElement<T>>;
    private elementSelection: SelectionModel<IDynamicElement<any>>;
    private contentSelectionSubject: Subject<IDynamicElementContent<T>>;
    private selection: BehaviorSubject<IDynamicElement<any>>;
    private contentProvider: IExplorerContentProvider<T>;
    private editable: boolean;

    private navigationEnabled: boolean;
    private rootElement: IDynamicElement<any>;
    private currentTopElement: BehaviorSubject<IDynamicElement<any>>;

    get root(): IDynamicElement<any> {
        return this.rootElement;
    }

    get currentTop(): Observable<IDynamicElement<any>> {
        return this.currentTopElement.asObservable();
    }

    get selectedElement(): IDynamicElement<any> {
        return this.selection.value;
    }

    constructor(public label: string, enableNavigation?: boolean) {
        super();
        this.navigationEnabled = !!enableNavigation;
        this.editable = false;
        this.createRoot();
        this.elementsSubject = new BehaviorSubject([]);
        this.elementsMap = new Map<string, IDynamicElement<T>>();
        this.contentSelectionSubject = new Subject<IDynamicElementContent<T>>();
        this.elementSelection = new SelectionModel<IDynamicElement<any>>(false, [], true);
        this.selection = new BehaviorSubject<IDynamicElement<any>>(null);
        this.collect = this.elementSelection.changed.subscribe(changes => {
            if (this.elementSelection.hasValue()) {
                const sel = this.elementSelection.selected[0];
                if (sel !== this.selection.value) {
                    this.selection.next(sel);
                    this.contentSelectionSubject.next(sel.content);
                }
            } else {
                if (this.selection.value) {
                    this.selection.next(null);
                    this.contentSelectionSubject.next(null);
                }
            }
        });
    }

    private createRoot(): void {
        const rootContent = new DynamicElementContent('ROOT', 'root', { label: this.label }, null, null);
        rootContent.formatter = {
            label: 'label'
        };
        this.rootElement = new DynamicElement<any>(rootContent);
        this.rootElement.icon = 'sitemap';
        this.currentTopElement = new BehaviorSubject<IDynamicElement<any>>(this.rootElement);
    }

    public isCurrentTop(elm: IDynamicElement<any>): boolean {
        if (!this.currentTopElement || !this.currentTopElement.value) {
            return false;
        }
        return this.currentTopElement.value === elm;
    }

    public withContentProvider(contentProvider: IExplorerContentProvider<T>): IDynamicExplorerManager<T> {
        this.contentProvider = contentProvider;
        return this;
    }

    public addData(...ctx: IExplorerDataContext<T>[]): IDynamicExplorerManager<T> {
        if (this.contentProvider) {
            if (ctx) {
                this.refreshTitle();
                ctx.forEach(c => {
                    const content = this.contentProvider.get(c);
                    this.addContent(content);
                });
            }
        }
        return this;
    }

    public removeData(...ctx: IExplorerDataContext<T>[]): IDynamicExplorerManager<T> {
        if (this.contentProvider) {
            if (ctx) {
                this.refreshTitle();
                ctx.forEach(c => {
                    const content = this.contentProvider.get(c);
                    this.removeContent(content);
                });
            }
        }
        return this;
    }

    public getDataById(id: string | number, type: string | number): T {
        if (!id || !type) {
            return null;
        }
        const content = this.getContentById(id, type);
        return content ? content.data : null;
    }

    public childsDataById(id: string | number, type: string | number): Observable<T[]> {
        return this.childContentsOf(DynamicElement.generateUniqueId(id, type)).pipe(map(childs => childs.map((val, indx) => val.data)));
    }

    public setEditable(editable: boolean): IDynamicExplorerManager<T> {
        this.editable = editable;
        return this;
    }

    public isEditable(): boolean {
        return this.editable;
    }

    public addElementAction(uniqueId: string, action: DynamicAction<any>): IDynamicExplorerManager<T> {
        if (!action) {
            return;
        }
        const elm = this.get(uniqueId);
        if (elm) {
            elm.addAction(action);
        }
        return this;
    }

    public addAction(id: string | number, type: string | number, action: DynamicAction<any>): IDynamicExplorerManager<T> {
        return this.addElementAction(DynamicElement.generateUniqueId(id, type), action);
    }

    public createContent(type: string, parent: IDynamicElementContent<T>): IDynamicElementContent<T> {
        if (this.contentProvider) {
            return this.contentProvider.create(type, parent);
        }
        return null;
    }

    public notifyContentCreated(type: string | number, data: T): void {
        if (this.contentProvider) {
            this.contentProvider.notifyCreated(type, data);
        }
    }
    public notifyContentUpdated(type: string | number, data: T): void {
        if (this.contentProvider) {
            this.contentProvider.notifyUpdated(type, data);
        }
    }
    public notifyContentDeleted(type: string | number, data: T): void {
        if (this.contentProvider) {
            this.contentProvider.notifyDeleted(type, data);
        }
    }

    public reset(): void {
        this.navigateTo(this.root);
        if (this.elementsMap) {
            this.elementsMap.forEach((value: IDynamicElement<any>) => value.destroy());
            this.elementsMap.clear();
        }
        this.elementSelection.clear();
        this.elementsSubject.next([]);
    }

    public destroy(): void {
        super.clean();
        if (this.elementsMap) {
            this.elementsMap.forEach((value: IDynamicElement<any>) => value.destroy());
            this.elementsMap.clear();
            this.elementsMap = undefined;
        }
        if (this.elementsSubject) {
            this.elementsSubject.complete();
            this.elementsSubject = undefined;
        }
        if (this.elementSelection) {
            this.elementSelection.clear();
            this.elementSelection = undefined;
        }
        if (this.currentTopElement) {
            this.currentTopElement.complete();
            this.currentTopElement = undefined;
        }
        if (this.selection) {
            this.selection.complete();
            this.selection = undefined;
        }
        if (this.contentSelectionSubject) {
            this.contentSelectionSubject.complete();
            this.contentSelectionSubject = undefined;
        }
    }

    private republishElements(): void {
        if (!this.elementsMap || !this.elementsSubject) {
            return;
        }
        const elms = Array.from(this.elementsMap.values());
        this.elementsSubject.next(elms);
    }

    private setupParentElement(elm: IDynamicElement<any>): void {
        if (!elm || !elm.content) {
            return;
        }
        const parentUniqueId = DynamicElement.generateUniqueId(elm.content.parentId, elm.content.parentType);
        elm.parent = this.get(parentUniqueId);
        if (!elm.parent) {
            elm.parent = this.root;
        }
    }

    public contentSelection(): Observable<IDynamicElementContent<T>> {
        return this.contentSelectionSubject.asObservable().pipe(distinctUntilChanged());
    }

    public getContent(uniqueId: string): IDynamicElementContent<T> {
        if (!uniqueId) {
            return null;
        }
        const elm = this.get(uniqueId);
        return elm ? elm.content : null;
    }

    public getContentById(id: string | number, type: string | number): IDynamicElementContent<T> {
        if (!id || !type) {
            return null;
        }
        const elm = this.get(DynamicElement.generateUniqueId(id, type));
        return elm ? elm.content : null;
    }

    public addContent(content: IDynamicElementContent<T>): DynamicElement<T> {
        if (!content || !this.elementsSubject) {
            return null;
        }
        const elm = new DynamicElement<T>(content);
        if (this.contentProvider) {
            this.contentProvider.configure(elm);
        }
        elm.view = elm.view ? elm.view : BaseElementViewComponent;
        this.add(elm);
        return elm;
    }

    public removeContent(content: IDynamicElementContent<T>): void {
        if (!content || !this.elementsSubject) {
            return null;
        }
        const elm = this.get(DynamicElement.generateUniqueId(content.id, content.type));
        if (elm) {
            this.emit(new EditorEvent(EditorAction.DELETE, elm));
        }
    }

    public childContentsById(id: string | number, type: string | number): Observable<IDynamicElementContent<any>[]> {
        return this.childContentsOf(DynamicElement.generateUniqueId(id, type));
    }

    public childContentsOf(uniqueId: string): Observable<IDynamicElementContent<any>[]> {
        return this.childsOf(uniqueId).pipe(map(childs => childs.map((val, indx) => val.content)));
    }

    public selected(uniqueId: string): Observable<boolean> {
        return this.selection.pipe(
            map(selElm => (selElm ? selElm.uniqueId === uniqueId : false)),
            filter(s => s === true)
        );
    }

    public isSelected(elm: IDynamicElement<any>): boolean {
        return this.elementSelection ? this.elementSelection.isSelected(elm) : false;
    }

    public deselect(elm: IDynamicElement<any>): void {
        this.elementSelection.deselect(elm);
    }

    public hasSelection(): boolean {
        return this.elementSelection ? this.elementSelection.hasValue() : false;
    }

    public getSelection(): IDynamicElement<any> {
        return this.selectedElement;
    }

    public select(elm: IDynamicElement<any>): void {
        if (elm && !this.isSelected(elm)) {
            this.elementSelection.toggle(elm);
            if (this.selectedElement) {
                this.selectedElement.expand();
            }
        }
    }

    public getElementById(id: string | number, type: string | number): IDynamicElement<any> {
        return this.get(DynamicElement.generateUniqueId(id, type));
    }

    public selectElementById(id: string | number, type: string | number): void {
        const elm = this.get(DynamicElement.generateUniqueId(id, type));
        this.select(elm);
    }

    public get(uniqueId: string): IDynamicElement<any> {
        if (!uniqueId || !this.elementsMap) {
            return undefined;
        }
        return this.elementsMap.get(uniqueId);
    }

    public add(elm: IDynamicElement<T>): void {
        if (!elm || !this.elementsMap) {
            return;
        }
        this.setupParentElement(elm);
        this.elementsMap.set(elm.uniqueId, elm);
        this.republishElements();
    }
    public delete(uniqueId: string): void {
        if (!uniqueId || !this.elementsMap) {
            return;
        }
        this.elementsMap.delete(uniqueId);
        this.republishElements();
    }

    public update(uniqueId: string, update: Partial<IDynamicElement<T>>): void {
        let source = this.get(uniqueId);
        source = Object.assign(source, update);
        this.elementsMap.set(source.uniqueId, source);
        this.republishElements();
    }

    public getChildTypesOf(type: string | number): Array<ChildType> {
        if (this.contentProvider) {
            return this.contentProvider.getChildTypesOf(type);
        }
        return null;
    }

    public emit(event: IEditorEvent<T>): void {
        if (!event) {
            return;
        }
        const elm = event.payload;
        const elmUniqueId = elm ? elm.uniqueId : null;

        // console.log('Editor event fired : ' + event.type);
        if (event.type === EditorAction.CREATE_CHILD) {
            if (this.contentProvider && elm) {
                const childContent = this.contentProvider.createChild(event.extra, elm.content);
                if (childContent) {
                    const childElm = this.addContent(childContent);
                    this.select(childElm);
                }
            }
        } else if (event.type === EditorAction.CREATE) {
            if (this.contentProvider && elm) {
                const newContent = this.contentProvider.create(elm.type, elm.content.parent);
                if (newContent) {
                    const newElm = this.addContent(newContent);
                    this.select(newElm);
                }
            }
        } else if (event.type === EditorAction.EDIT) {
            if (this.contentProvider && elm) {
                const updatedContent = this.contentProvider.update(elm.content);
                if (updatedContent) {
                    elm.content = updatedContent;
                    this.update(elmUniqueId, elm);
                    this.select(elm);
                }
            }
        } else if (event.type === EditorAction.DELETE) {
            if (this.contentProvider && elm) {
                const parentElm = elm.parent;
                this.contentProvider.delete(elm.content);
                this.delete(elmUniqueId);
                this.select(parentElm);
            }
        }
    }

    public isNavigationEnabled(): boolean {
        return this.navigationEnabled;
    }

    public navigateById(id: string | number, type: string | number): void {
        const elm = this.get(DynamicElement.generateUniqueId(id, type));
        this.navigateTo(elm);
    }

    public navigateTo(target: IDynamicElement<any>): void {
        if (!target) {
            return;
        }
        this.currentTopElement.next(target);
        this.select(target);
    }

    public navigate(event: INavigationEvent<T>): void {
        if (!event || !event.payload) {
            return;
        }
        const elm = event.payload;

        // console.log('Navigation event fired : ' + event.type);
        if (event.type === NavigationAction.UP) {
            this.navigateTo(elm.parent);
        } else if (event.type === NavigationAction.TOP) {
            this.navigateTo(this.root);
        } else if (event.type === NavigationAction.SELF) {
            this.navigateTo(elm);
        }
    }

    public childsOf(uniqueId: string): Observable<IDynamicElement<any>[]> {
        return this.elementsSubject.pipe(map((value: IDynamicElement<any>[]) => this.filterChildOf(uniqueId, value)));
    }

    private filterChildOf(uniqueId: string, elements: Array<IDynamicElement<any>>): Array<IDynamicElement<any>> {
        return elements.filter(elm => elm.parentUniqueId === uniqueId);
    }

    private refreshTitle(): void {
        if (this.root && this.root.content && this.root.content.data) {
            this.root.content.data.label = this.label;
        }
    }
}
