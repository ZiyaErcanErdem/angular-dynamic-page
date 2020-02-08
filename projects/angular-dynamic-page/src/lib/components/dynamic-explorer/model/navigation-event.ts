import { NavigationAction } from './navigation-action.enum';
import { IDynamicElement } from './dynamic-element';

export interface INavigationEvent<T> {
    type: NavigationAction;
    payload?: IDynamicElement<T>;
    extra?: any;
}

export class NavigationEvent<T> implements INavigationEvent<T> {
    constructor(public type: NavigationAction, public payload?: IDynamicElement<T>, public extra?: any) {}
}
