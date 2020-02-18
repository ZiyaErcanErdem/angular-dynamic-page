export interface PopoverCloseEvent<R = any> {
    type: 'backdropClick' | 'close';
    data: R;
}
