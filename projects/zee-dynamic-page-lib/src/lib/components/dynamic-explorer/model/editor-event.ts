import { EditorAction } from './editor-action.enum';
import { IDynamicElement } from './dynamic-element';

export interface IEditorEvent<T> {
    type: EditorAction;
    payload?: IDynamicElement<T>;
    extra?: any;
}

export class EditorEvent<T> implements IEditorEvent<T> {
    constructor(public type: EditorAction, public payload?: IDynamicElement<T>, public extra?: any) {}
}
