import { IDynamicElementContent } from './dynamic-element-content';
import { IExplorerDataContext } from './explorer-data-context';
import { IDynamicElement } from './dynamic-element';
import { ChildType } from './dynamic-explorer-manager';

export interface IExplorerContentProvider<T> {
    create(type: string | number, parent: IDynamicElementContent<T>): IDynamicElementContent<T>;
    createChild(childType: string | number, parent: IDynamicElementContent<T>): IDynamicElementContent<T>;
    get(context: IExplorerDataContext<T>): IDynamicElementContent<T>;
    update(content: IDynamicElementContent<T>): IDynamicElementContent<T>;
    delete(content: IDynamicElementContent<T>): boolean;
    configure(element: IDynamicElement<T>): void;
    getChildTypesOf(type: string | number): Array<ChildType>;
    notifyCreated(type: string | number, data: T): void;
    notifyUpdated(type: string | number, data: T): void;
    notifyDeleted(type: string | number, data: T): void;
}
