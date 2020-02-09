import { PanelState } from './panel-state.enum';
import { DynamicAction } from './dynamic-action';
import { DynamicBaseComponent } from './dynamic-base-component';
import { OnDestroy, Input, Directive } from '@angular/core';
import { Theme } from './theme.enum';

@Directive()
export class BasePanelView extends DynamicBaseComponent implements OnDestroy {
    @Input()
    public theme: Theme;
    @Input()
    public title: string;
    public panelState: PanelState;
    public panelActions: Array<DynamicAction<any>>;
    protected destroyActionsOnClean: boolean;

    protected set action(a: DynamicAction<any>) {
        if (a && this.panelActions && !this.panelActions.includes(a)) {
            this.panelActions.push(a);
        }
    }

    constructor() {
        super();
        this.destroyActionsOnClean = true;
        this.theme = Theme.dark;
        this.panelState = PanelState.EXPANDED;
        this.panelActions = new Array<DynamicAction<any>>();
    }

    public ngOnDestroy(): void {
        this.clean();
    }

    public clean(): void {
        if (this.panelActions) {
            if (this.destroyActionsOnClean) {
                this.panelActions.forEach(a => a.destroy());
            }
            this.panelActions = undefined;
        }
        super.clean();
    }

    public handlePanelStateChange(state: PanelState): void {
        this.panelState = state;
    }

    public collapse(): void {
        this.panelState = PanelState.COLLAPSED;
    }

    public isCollapsed(): boolean {
        return this.panelState === PanelState.COLLAPSED;
    }

    public expand(): void {
        this.panelState = PanelState.EXPANDED;
    }

    public isExpanded(): boolean {
        return this.panelState === PanelState.EXPANDED;
    }

    public setThemeWith(val: string): void {
        let selectedTheme: Theme;
        switch (val) {
            case 'PRIMARY': {
                selectedTheme = Theme.primary;
                break;
            }
            case 'INFO': {
                selectedTheme = Theme.info;
                break;
            }
            case 'SUCCESS': {
                selectedTheme = Theme.success;
                break;
            }
            case 'WARNING': {
                selectedTheme = Theme.warning;
                break;
            }
            case 'DANGER': {
                selectedTheme = Theme.danger;
                break;
            }
            default: {
                selectedTheme = Theme.dark;
            }
        }
        this.theme = selectedTheme;
    }
}
