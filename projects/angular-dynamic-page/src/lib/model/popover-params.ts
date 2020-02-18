import { PopoverConfig } from './popover-config';
import { PopoverContent } from './popover-content';
import { PopoverType } from './popover-type';

export type PopoverParams<C = any> = {
    type: PopoverType,
    content: PopoverContent;
    config?: PopoverConfig;
    context?: C;
    origin?: HTMLElement;
};
