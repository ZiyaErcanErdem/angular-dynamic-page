import { PopoverType } from './popover-type';
import { DynamicAction } from './dynamic-action';
import { Theme } from './theme.enum';

export type PopoverConfig = {
    type: PopoverType;
    title?: string;
    i18n?: boolean;
    actions?: Array<DynamicAction<any>>;
    i18nParams?: object;
    header?: boolean;
    footer?: boolean;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    theme?: Theme;
};
