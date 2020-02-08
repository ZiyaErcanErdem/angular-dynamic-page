import { PopoverConfig } from './popover-config';
import { PopoverContent } from './popover-content';

export type PopoverParams<C = any> = {
    config: PopoverConfig;
    content: PopoverContent;
    context?: C;
    origin?: HTMLElement;
};
