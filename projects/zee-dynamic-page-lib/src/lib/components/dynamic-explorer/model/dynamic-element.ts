import { IDynamicElementContent, ElementView } from './dynamic-element-content';
import { DynamicAction } from '../../../model/dynamic-action';

export interface IDynamicElement<T> {
    uniqueId: string;
    id?: string | number;
    type: string | number;
    icon?: string;
    view: ElementView;
    viewContext?: any;
    content: IDynamicElementContent<T>;

    parentUniqueId: string;
    parentId: string | number;
    parent: IDynamicElement<T>;

    actions?: Array<DynamicAction<IDynamicElementContent<T>>>;

    addAction: (action: DynamicAction<IDynamicElementContent<T>>) => void;
    expand: () => void;
    collapse: () => void;
    toggle: () => void;
    isExpanded: () => boolean;
    destroy: () => void;
}

export class DynamicElement<T> implements IDynamicElement<T> {
    private _parent: IDynamicElement<T>;
    private _expanded: boolean;

    public icon?: string;
    public view: ElementView;
    public viewContext?: any;
    public actions?: Array<DynamicAction<IDynamicElementContent<T>>>;

    set parent(val: IDynamicElement<T>) {
        this._parent = val;
        if (this.content) {
            this.content.parent = val ? val.content : null;
        }
    }

    get parent(): IDynamicElement<T> {
        return this._parent;
    }

    get uniqueId(): string {
        return `${this.id}@${this.type}`;
    }

    get id(): string | number {
        return this.content ? this.content.id : null;
    }

    get type(): string | number {
        return this.content ? this.content.type : null;
    }

    get parentUniqueId(): string {
        return this.parent ? this.parent.uniqueId : null;
    }
    get parentId(): string | number {
        return this.parent && this.parent.content ? this.parent.content.id : null;
    }

    constructor(public readonly content: IDynamicElementContent<T>) {
        this.actions = new Array<DynamicAction<IDynamicElementContent<T>>>();
    }

    public static getUniqueIdOf(content: IDynamicElementContent<any>): string {
        return content ? `${content.id}@${content.type}` : null;
    }

    public static generateUniqueId(id: string | number, type: string | number): string {
        return type ? `${id}@${type}` : null;
    }
    
    public expand(): void {
        this._expanded = true;
        if (this.parent) {
            this._parent.expand();
        }
    }

    public collapse(): void {
        this._expanded = false;
    }

    public isExpanded(): boolean {
        return this._expanded;
    }

    public toggle(): void {
        this._expanded = !this._expanded;
    }

    public addAction(action: DynamicAction<IDynamicElementContent<T>>): void {
        if (!action) {
            return;
        }
        this.actions.push(action);
    }

    public destroy(): void {
        if (this.actions) {
            this.actions.forEach(a => a.destroy());
            this.actions = undefined;
        }
        this.view = undefined;
        this.viewContext = undefined;
        this._parent = undefined;
        if (this.content) {
            this.content.destroy();
        }
    }
}
