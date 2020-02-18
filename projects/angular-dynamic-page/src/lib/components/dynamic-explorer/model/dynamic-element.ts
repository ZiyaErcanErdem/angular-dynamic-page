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
    private parentElement: IDynamicElement<T>;
    private elementExpanded: boolean;

    public icon?: string;
    public view: ElementView;
    public viewContext?: any;
    public actions?: Array<DynamicAction<IDynamicElementContent<T>>>;

    set parent(val: IDynamicElement<T>) {
        this.parentElement = val;
        if (this.content) {
            this.content.parent = val ? val.content : null;
        }
    }

    get parent(): IDynamicElement<T> {
        return this.parentElement;
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
        this.elementExpanded = true;
        if (this.parent) {
            this.parentElement.expand();
        }
    }

    public collapse(): void {
        this.elementExpanded = false;
    }

    public isExpanded(): boolean {
        return this.elementExpanded;
    }

    public toggle(): void {
        this.elementExpanded = !this.elementExpanded;
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
        this.parentElement = undefined;
        if (this.content) {
            this.content.destroy();
        }
    }
}
