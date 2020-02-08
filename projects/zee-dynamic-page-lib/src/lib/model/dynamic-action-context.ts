import { GenericDynamicAction } from './dynamic-action';

export class DynamicActionContext {
    public readonly id: string | number;
    private active: boolean;
    private initialized: boolean;
    private preActiveState: boolean;
    private preVisibilityState: boolean;

    public set badge(value: string) {
        this.action.badge = value;
    }

    public set label(value: string) {
        this.action.label = value;
    }

    constructor(public action: GenericDynamicAction<any>) {
        this.id = action.id;
        this.active = false;
        this.initialized = false;
    }

    public toggleActivation(): void {
        this.active = !this.active;
        this.initialized = this.initialized || this.active;
    }

    public keepStateAndActivate(): void {
        this.preActiveState = this.active;
        this.activate();
    }

    public keepStateAndPassivate(): void {
        this.preActiveState = this.active;
        this.passivate();
    }

    public restoreActivation(): void {
        this.active = !!this.preActiveState;
    }

    public activate(): void {
        this.active = true;
        this.initialized = this.initialized || this.active;
    }

    public passivate(): void {
        this.active = false;
    }

    public deinitialize(): void {
        this.initialized = false;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public isActive(): boolean {
        return this.active;
    }

    public isPassive(): boolean {
        return !this.isActive();
    }

    public isVisible(): boolean {
        return !!this.action.visible;
    }

    public isHidden(): boolean {
        return !this.isVisible();
    }

    public isEnabled(): boolean {
        return !this.isDisabled();
    }

    public isDisabled(): boolean {
        return !!this.action.disabled;
    }

    public hide(): void {
        this.action.visible = false;
    }

    public restoreVisibility(): void {
        this.action.visible = !!this.preVisibilityState;
    }

    public keepStateAndHide(): void {
        this.preVisibilityState = this.action.visible;
        this.hide();
    }

    public show(): void {
        this.action.visible = true;
    }

    public keepStateAndShow(): void {
        this.preVisibilityState = this.action.visible;
        this.show();
    }

    public disable(): void {
        this.action.disabled = true;
    }

    public enable(): void {
        this.action.disabled = false;
    }

    public destroy(): void {
        if (this.action) {
            this.action.destroy();
            this.action = undefined;
        }
    }
}
