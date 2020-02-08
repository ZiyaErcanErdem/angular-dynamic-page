import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class DynamicBaseComponent implements OnDestroy {
    private subscriptions: Subscription;

    constructor() {
        this.subscriptions = new Subscription();
    }

    protected set collect(s: Subscription) {
        if (this.subscriptions) {
            this.subscriptions.add(s);
        }
    }

    protected set collectAll(subs: Subscription[]) {
        if (subs && this.subscriptions) {
            subs.forEach(s => this.subscriptions.add(s));
        }
    }

    protected reset(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
            this.subscriptions = new Subscription();
        }
    }

    protected clean(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
            this.subscriptions = undefined;
        }
    }

    public ngOnDestroy(): void {
        this.clean();
    }
}
