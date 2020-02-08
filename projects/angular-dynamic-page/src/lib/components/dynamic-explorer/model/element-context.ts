import { IDynamicElementContent } from './dynamic-element-content';
import { Theme } from '../../../model/theme.enum';

export class ElementContext<T> {
    constructor(public content: IDynamicElementContent<T>, public theme: Theme) {}
}
