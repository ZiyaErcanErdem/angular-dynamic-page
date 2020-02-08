import { GenericDynamicAction } from './dynamic-action';
import { DynamicActionContext } from './dynamic-action-context';

export class DynamicActionManager {
    private dynamicActionsMap: Map<string | number, DynamicActionContext>;
    public actions: Array<GenericDynamicAction<any>>;

    constructor() {
        this.dynamicActionsMap = new Map<string, DynamicActionContext>();
        this.actions = new Array<GenericDynamicAction<any>>();
    }

    public set action(value: GenericDynamicAction<any>) {
        this.addAction(value);
    }

    public addAction(action: GenericDynamicAction<any>): DynamicActionManager {
        if (!action || this.exists(action.id)) {
            return this;
        }
        const ctx = new DynamicActionContext(action);
        this.dynamicActionsMap.set(action.id, ctx);
        this.actions.push(action);
        return this;
    }

    public exists(actionId: string | number): boolean {
        if (!actionId) {
            return false;
        }
        return this.dynamicActionsMap.has(actionId);
    }

    public removeAction(actionId: string | number): DynamicActionManager {
        if (!actionId) {
            return this;
        }
        const ctx = this.dynamicActionsMap.get(actionId);
        if (ctx) {
            this.dynamicActionsMap.delete(actionId);
            const index = this.actions.indexOf(ctx.action);
            if (index > -1) {
                this.actions.splice(index, 1);
            }
        }
        return this;
    }

    private getActionContext(actionId: string | number): DynamicActionContext {
        if (!actionId) {
            return;
        }
        return this.dynamicActionsMap.get(actionId);
    }

    public getAction(actionId: string | number): GenericDynamicAction<any> {
        if (!actionId) {
            return;
        }
        const ctx = this.getActionContext(actionId);
        return ctx ? ctx.action : undefined;
    }

    public badge(actionId: string | number, value: string): DynamicActionManager {
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            ctx.badge = value;
        }
        return this;
    }

    public label(actionId: string | number, value: string): DynamicActionManager {
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            ctx.label = value;
        }
        return this;
    }

    public isInitialized(actionId: string | number): boolean {
        if (!actionId) {
            return false;
        }
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            return ctx.isInitialized();
        }
        return false;
    }

    public isPassive(actionId: string | number): boolean {
        if (!actionId) {
            return true;
        }
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            return ctx.isPassive();
        }
        return true;
    }

    public isActive(actionId: string | number): boolean {
        if (!actionId) {
            return false;
        }
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            return ctx.isActive();
        }
        return false;
    }

    public isVisible(actionId: string | number): boolean {
        if (!actionId) {
            return false;
        }
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            return ctx.isVisible();
        }
        return true;
    }

    public isHidden(actionId: string | number): boolean {
        if (!actionId) {
            return false;
        }
        return !this.isVisible(actionId);
    }

    public isEnabled(actionId: string | number): boolean {
        if (!actionId) {
            return false;
        }
        const ctx = this.getActionContext(actionId);
        if (ctx) {
            return ctx.isEnabled();
        }
        return true;
    }

    public isDisabled(actionId: string | number): boolean {
        if (!actionId) {
            return true;
        }
        return !this.isEnabled(actionId);
    }

    public deinitialize(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.deinitialize();
            }
        });
        return this;
    }

    public toggleActivation(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.toggleActivation();
            }
        });
        return this;
    }

    public restoreActivation(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.restoreActivation();
            }
        });
        return this;
    }

    public activateIf(predicate: boolean, ...includes: Array<string | number>): DynamicActionManager {
        if (!predicate) {
            return this;
        }
        return this.activate(...includes);
    }

    public activate(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.activate();
            }
        });
        return this;
    }

    public passivateIf(predicate: boolean, ...includes: Array<string | number>): DynamicActionManager {
        if (!predicate) {
            return this;
        }
        return this.passivate(...includes);
    }

    public passivate(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.passivate();
            }
        });
        return this;
    }

    public activateAll(): DynamicActionManager {
        return this.activateAllBut();
    }

    public activateAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.activate();
            }
        });
        return this;
    }

    public keepStateAndActivateAll(): DynamicActionManager {
        return this.keepStateAndActivateAllBut();
    }

    public keepStateAndActivateAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.keepStateAndActivate();
            }
        });
        return this;
    }

    public keepStateAndPassivateAll(): DynamicActionManager {
        return this.keepStateAndPassivateAllBut();
    }

    public keepStateAndPassivateAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.keepStateAndPassivate();
            }
        });
        return this;
    }

    public restoreAllActivation(): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => a.restoreActivation());
        return this;
    }

    public keepStateAndHideAll(): DynamicActionManager {
        return this.keepStateAndHideAllBut();
    }

    public keepStateAndHideAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.keepStateAndHide();
            }
        });
        return this;
    }

    public keepStateAndShowAll(): DynamicActionManager {
        return this.keepStateAndShowAllBut();
    }

    public keepStateAndShowAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.keepStateAndShow();
            }
        });
        return this;
    }

    public restoreAllVisibility(): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => a.restoreVisibility());
        return this;
    }

    public passivateAll(): DynamicActionManager {
        return this.passivateAllBut();
    }

    public passivateAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.passivate();
            }
        });
        return this;
    }

    public disableIf(predicate: boolean, ...includes: Array<string | number>): DynamicActionManager {
        if (!predicate) {
            return this;
        }
        return this.disable(...includes);
    }

    public disableIfActive(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx && ctx.isActive()) {
                ctx.disable();
            }
        });
        return this;
    }

    public disable(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.disable();
            }
        });
        return this;
    }

    public disableAll(): DynamicActionManager {
        return this.disableAllBut();
    }

    public disableAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.disable();
            }
        });
        return this;
    }

    public enableIf(predicate: boolean, ...includes: Array<string | number>): DynamicActionManager {
        if (!predicate) {
            return this;
        }
        return this.enable(...includes);
    }

    public enableIfPassive(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx && ctx.isPassive()) {
                ctx.enable();
            }
        });
        return this;
    }

    public enable(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.enable();
            }
        });
        return this;
    }

    public enableAll(): DynamicActionManager {
        return this.enableAllBut();
    }

    public enableAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.enable();
            }
        });
        return this;
    }

    public hideIf(predicate: boolean, ...includes: Array<string | number>): DynamicActionManager {
        if (!predicate) {
            return this;
        }
        return this.hide(...includes);
    }

    public hideIfActive(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx && ctx.isActive()) {
                ctx.hide();
            }
        });
        return this;
    }

    public hide(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.hide();
            }
        });
        return this;
    }

    public hideAll(): DynamicActionManager {
        return this.hideAllBut();
    }

    public hideAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.hide();
            }
        });
        return this;
    }

    public showIf(predicate: boolean, ...includes: Array<string | number>): DynamicActionManager {
        if (!predicate) {
            return this;
        }
        return this.show(...includes);
    }

    public showIfPassive(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx && ctx.isPassive()) {
                ctx.show();
            }
        });
        return this;
    }

    public show(...includes: Array<string | number>): DynamicActionManager {
        if (!includes) {
            return this;
        }
        includes.forEach(id => {
            const ctx = this.getActionContext(id);
            if (ctx) {
                ctx.show();
            }
        });
        return this;
    }

    public showAll(): DynamicActionManager {
        return this.showAllBut();
    }

    public showAllBut(...excludes: Array<string | number>): DynamicActionManager {
        this.dynamicActionsMap.forEach(a => {
            if (!excludes || !excludes.some(e => e === a.id)) {
                a.show();
            }
        });
        return this;
    }

    public destroy(): void {
        this.actions.forEach(a => a.destroy());
        this.actions = [];
        this.dynamicActionsMap.clear();
        this.dynamicActionsMap = undefined;
    }
}
