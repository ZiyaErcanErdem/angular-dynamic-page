export type PopoverCloseEvent<R = any> = {
    type: 'backdropClick' | 'close';
    data: R;
};
