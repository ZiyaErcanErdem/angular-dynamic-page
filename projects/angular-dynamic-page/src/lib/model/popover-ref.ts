import { Subject, Observable } from 'rxjs';
import { PopoverCloseEvent } from './popover-close-event';
import { PopoverConfig } from './popover-config';
import { OverlayRef } from '@angular/cdk/overlay';
import { PopoverContent } from './popover-content';
import { PopoverType } from './popover-type';

export class PopoverRef<C, R = any> {
    private afterClosed: Subject<PopoverCloseEvent<R>>;
    public afterClosed$: Observable<PopoverCloseEvent<R>>;

    constructor(
        public readonly type: PopoverType,
        public readonly config: PopoverConfig,
        public overlay: OverlayRef,
        public content: PopoverContent,
        public context: C
    ) {
        this.afterClosed = new Subject<PopoverCloseEvent<R>>();
        this.afterClosed$ = this.afterClosed.asObservable();
        this.overlay.backdropClick().subscribe(() => {
            this._close('backdropClick', null);
        });
    }

    public close(data?: R) {
        this._close('close', data);
    }

    private _close(type: PopoverCloseEvent['type'], data?: R) {
        this.overlay.dispose();
        this.config.actions = undefined;
        this.afterClosed.next({
            type,
            data
        });
        this.afterClosed.complete();
    }
}
