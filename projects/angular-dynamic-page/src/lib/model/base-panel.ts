import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PanelState } from './panel-state.enum';
import { DynamicAction } from './dynamic-action';


export class BasePanel implements OnInit {
    @Input()
    title: string;
    @Input()
    closable = false;
    @Input()
    maximizable = true;
    @Input()
    minimizable = true;
    @Input()
    panelState: PanelState;
    @Input()
    actions: Array<DynamicAction<any>> = [];
    @Output()
    panelStateChanged: EventEmitter<PanelState> = new EventEmitter();

    constructor() {
        this.panelState = PanelState.EXPANDED;
    }

    get isContentVisible(): boolean {
        return this.panelState === PanelState.MAXIMIZED || this.panelState === PanelState.EXPANDED;
    }

    get isCollapseIconVisible(): boolean {
        return this.minimizable && (this.panelState !== PanelState.COLLAPSED && this.panelState !== PanelState.MAXIMIZED);
    }

    get isExpandIconVisible(): boolean {
        return (this.minimizable || this.panelState === PanelState.MAXIMIZED) && this.panelState !== PanelState.EXPANDED;
    }

    get isMaximizeIconVisible(): boolean {
        return this.maximizable && this.panelState !== PanelState.MAXIMIZED;
    }

    get isCloseIconVisible(): boolean {
        return this.closable;
    }

    get collapseIcon(): string {
        return 'minus-square';
    }

    get expandIcon(): string {
        return PanelState.MAXIMIZED === this.panelState ? 'window-restore' : 'plus-square';
    }

    get expandTitle(): string {
        return PanelState.MAXIMIZED === this.panelState ? 'dynamic.action.panelrestore' : 'dynamic.action.panelexpand';
    }

    get maximizeIcon(): string {
        return 'window-maximize';
    }

    get closeIcon(): string {
        return 'window-close';
    }

    get containerClass(): string {
        return this.panelState === PanelState.MAXIMIZED ? 'panel-maximized' : 'panel-normal h-100';
    }

    get headerClass(): string {
        return this.isContentVisible ? 'rounded-top' : 'dyn-panel-header-closed rounded';
    }

    get bodyClass(): string {
        return this.panelState === PanelState.MAXIMIZED ? 'panel-body-maximized' : 'panel-body-normal mh-100 h-auto flex-column flex-fill';
    }

    public maximize(): void {
        this.panelState = PanelState.MAXIMIZED;
        this.emitStateChanged(this.panelState);
    }

    public collapse(): void {
        this.panelState = PanelState.COLLAPSED;
        this.emitStateChanged(this.panelState);
    }

    public expand(): void {
        this.panelState = PanelState.EXPANDED;
        this.emitStateChanged(this.panelState);
    }

    public toggle(event: Event): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (this.minimizable && this.panelState === PanelState.EXPANDED) {
            this.collapse();
        } else if (this.minimizable && this.panelState === PanelState.COLLAPSED) {
            this.expand();
        }
    }

    public close(): void {
        // this.panelState = PanelState.CLOSED;
        this.emitStateChanged(PanelState.CLOSED);
    }

    ngOnInit() {
        this.emitStateChanged(this.panelState);
    }

    private emitStateChanged(state: PanelState): void {
        this.panelStateChanged.emit(state);
    }
}
