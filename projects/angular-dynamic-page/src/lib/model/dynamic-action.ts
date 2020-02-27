import { Subject } from 'rxjs';
import { DynamicBaseComponent } from './dynamic-base-component';
import { throttleTime } from 'rxjs/operators';
import { DynamicUtil } from './dynamic-util';
import { Theme } from './theme.enum';

export enum ActionType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    VIEW = 'VIEW',
    LIST = 'LIST',
    SEARCH = 'SEARCH',
    CANCEL = 'CANCEL',
    OK = 'OK',
    CUSTOM = 'CUSTOM'
}

export enum ActionScope {
    PAGE = 'PAGE',
    EDITOR = 'EDITOR',
    GRID = 'GRID',
    QUERY = 'QUERY',
    TOOLBAR = 'TOOLBAR',
    VIEW = 'VIEW',
    RELATION = 'RELATION',
    ALERT = 'ALERT',
    POPUP = 'POPUP',
    DIALOG = 'DIALOG',
    CUSTOM = 'CUSTOM'
}

export abstract class DynamicAction<D> extends DynamicBaseComponent {
    public readonly type: ActionType;
    private scopes: Array<ActionScope>;
    public readonly id: string | number;
    protected propOrder: number;
    protected propLabel: string;
    protected propBadge: string;
    protected propButtonClass: string;
    protected propIconClass: string;
    protected propDisplay: boolean;
    protected propDisabled: boolean;
    private propData: D;
    protected propI18n: boolean;
    protected propPayload: D;
    protected propButtonType: 'button' | 'dropdown' | 'split';

    protected propOrigin: HTMLElement;

    protected subject: Subject<D>;

    constructor(
        id: string | number,
        scopes: Array<ActionScope>,
        type: ActionType,
        buttonType: 'button' | 'dropdown' | 'split',
        label?: string,
        badge?: string,
        btnCls?: string,
        iconCls?: string,
        i18n = true,
        payload: D = null
    ) {
        super();
        this.scopes = new Array<ActionScope>();
        this.id = id;
        this.type = type;
        if (scopes && scopes.length > 0) {
            this.scopes = this.scopes.concat(scopes);
        }
        this.propLabel = label || label === '' ? label : '' + id;
        this.propBadge = badge;
        this.propButtonClass = btnCls;
        this.propButtonType = buttonType;
        this.propIconClass = iconCls;
        this.propDisplay = true;
        this.propDisabled = false;
        this.propOrder = 0;
        this.subject = new Subject<D>();
        this.propI18n = i18n;
        this.propPayload = payload;
        this.collect = this.subject.pipe(throttleTime(500)).subscribe(d => this.handle(d));
    }

    protected abstract handle(data: D): void;

    public abstract get childs(): Array<DynamicAction<D>>;
    public abstract hasChilds(): boolean;

    public destroy(): void {
        this.clean();
        if (this.subject) {
            this.subject.complete();
            this.subject = undefined;
        }
        this.propData = undefined;
        this.propPayload = undefined;
        this.scopes = undefined;
    }

    public emit(data: D, origin?: HTMLElement): void {
        this.propData = data ? data : this.propPayload;
        this.propOrigin = origin;
        this.subject.next(this.propData);
        this.propOrigin = undefined;
    }

    public get order(): number {
        return this.propOrder;
    }

    public get label(): string {
        return this.propLabel;
    }

    public get badge(): string {
        return this.propBadge;
    }

    public get i18n(): boolean {
        return this.propI18n;
    }

    public get payload(): D {
        return this.propPayload;
    }

    public get origin(): HTMLElement {
        return this.propOrigin;
    }

    public get buttonClass(): string {
        return this.propButtonClass;
    }

    public get iconClass(): string {
        return this.propIconClass;
    }

    public get disabled(): boolean {
        return !!this.propDisabled;
    }

    public get visible(): boolean {
        return !!this.propDisplay;
    }

    public get data(): D {
        return this.propData;
    }

    public get buttonType(): 'button' | 'dropdown' | 'split' {
        return this.propButtonType;
    }

    public containsScope(scope: ActionScope): boolean {
        if (!scope) {
            return false;
        }
        return this.scopes.includes(scope);
    }
}

export class GenericDynamicAction<D> extends DynamicAction<D> {
    private handlerAction: (action: GenericDynamicAction<D>, data: D) => void;
    private childActions: Array<GenericDynamicAction<D>>;

    constructor(
        id: string | number,
        scopes: Array<ActionScope>,
        type: ActionType,
        buttonType: 'button' | 'dropdown' | 'split',
        handler: (action: GenericDynamicAction<D>, data: D) => void,
        label?: string,
        badge?: string,
        btnCls?: string,
        iconCls?: string,
        i18n = true,
        payload = null
    ) {
        super(id, scopes, type, buttonType, label, badge, btnCls, iconCls, i18n, payload);
        this.childActions = new Array<GenericDynamicAction<D>>();
        this.handlerAction = handler;
    }

    public get order(): number {
        return this.propOrder;
    }

    public set order(value: number) {
        this.propOrder = value;
    }

    public get label(): string {
        return this.propLabel;
    }

    public set label(value: string) {
        this.propLabel = value;
    }

    public get badge(): string {
        return this.propBadge;
    }

    public set badge(value: string) {
        this.propBadge = value;
    }
    public get buttonType(): 'button' | 'dropdown' | 'split' {
        return this.propButtonType;
    }

    public set buttonType(value: 'button' | 'dropdown' | 'split') {
        this.propButtonType = value;
    }

    public get buttonClass(): string {
        return this.propButtonClass;
    }

    public set buttonClass(value: string) {
        this.propButtonClass = value;
    }

    public get iconClass(): string {
        return this.propIconClass;
    }

    public set iconClass(value: string) {
        this.propIconClass = value;
    }

    public get disabled(): boolean {
        return !!this.propDisabled;
    }

    public set disabled(value: boolean) {
        this.propDisabled = !!value;
    }

    public get visible(): boolean {
        return !!this.propDisplay || this.childs.length > 0;
    }

    public set visible(value: boolean) {
        this.propDisplay = !!value;
    }

    public get i18n(): boolean {
        return !!this.propI18n;
    }

    public set i18n(value: boolean) {
        this.propI18n = !!value;
    }

    public get payload(): D {
        return this.propPayload;
    }

    public set payload(value: D) {
        this.propPayload = value;
    }

    public set handler(value: (action: GenericDynamicAction<D>, data: D) => void) {
        this.handlerAction = value;
    }

    public get childs(): Array<DynamicAction<D>> {
        return this.childActions.length === 0 ? this.childActions : this.childActions.filter(c => !c.disabled && c.visible);
    }

    public forEachChild(childIterator: (c: GenericDynamicAction<D>) => void): void {
        if (this.childActions && childIterator) {
            this.childActions.forEach(c => childIterator(c));
        }
    }

    protected handle(data: D) {
        if (this.handlerAction) {
            this.handlerAction(this, data);
        }
    }

    public hasChilds(): boolean {
        return this.childs && this.childs.length > 0;
    }

    public addChild(child: GenericDynamicAction<D>): void {
        if (!child || this.childActions.some(c => c.id === child.id)) {
            return;
        }
        this.childActions.push(child);
    }

    public destroyChilds(): void {
        if (this.childActions) {
            this.childActions.forEach(c => c.destroy());
            this.childActions = [];
        }
    }

    public destroy(): void {
        super.destroy();
        this.handlerAction = undefined;
        this.payload = undefined;
        if (this.childActions) {
            this.childActions.forEach(c => c.destroy());
            this.childActions = undefined;
        }
    }
}

let globalOrder = 10000;
export class DynamicActionBuilder<D> {
    private handlerAction: (action: GenericDynamicAction<D>, data: D) => void;
    private propType: ActionType;
    private propScopes: Array<ActionScope>;
    private propId: string | number;
    private propLabel: string;
    private propBadge: string;
    private propButtonClass: string;
    private propButtonType: 'button' | 'dropdown' | 'split' = 'button';
    private propIconClass: string;
    private propOrder = 0;
    private propDisplay = true;
    private propDisabled = false;
    private propI18n = true;
    private propPayload: D = null;

    private childsProvider: (parent: DynamicAction<D>) => Array<GenericDynamicAction<D>>;

    constructor(id: string | number, type: ActionType) {
        this.propId = id;
        this.propType = type;
        this.propScopes = new Array<ActionScope>();
        this.handlerAction = d => {};
        this.childsProvider = p => null;
    }

    public static newAction<A>(
        id: string,
        label: string,
        btnTheme: Theme,
        icon: string,
        handler: (c, d) => void,
        provider?: (p) => Array<GenericDynamicAction<A>>,
        i18n = true,
        payload: A = null
    ): GenericDynamicAction<A> {
        const handlerFn = (comp, d) => {
            comp.disabled = true;
            handler(comp, d);
            comp.disabled = false;
        };
        return new DynamicActionBuilder<A>(id, ActionType.CUSTOM)
            .withScope(ActionScope.TOOLBAR)
            .withLabel(label)
            .withButtonClass(DynamicUtil.buttonThemeFor(btnTheme))
            .withIconClass(icon)
            .withI18n(i18n)
            .withPayload(payload)
            .withChildsProvider(provider)
            .withHandler(handlerFn)
            .build();
    }

    public withScope(...scopes: ActionScope[]): DynamicActionBuilder<D> {
        if (scopes && scopes.length > 0) {
            this.propScopes = [...this.propScopes, ...scopes];
        }
        return this;
    }

    public withHandler(handler: (action: GenericDynamicAction<D>, data: D) => void): DynamicActionBuilder<D> {
        this.handlerAction = handler;
        return this;
    }

    public withLabel(label: string): DynamicActionBuilder<D> {
        this.propLabel = label;
        return this;
    }

    public withBadge(badge: string): DynamicActionBuilder<D> {
        this.propBadge = badge;
        return this;
    }

    public withButtonClass(buttonClass: string): DynamicActionBuilder<D> {
        this.propButtonClass = buttonClass;
        return this;
    }

    public withButtonType(buttonType: 'button' | 'dropdown' | 'split'): DynamicActionBuilder<D> {
        this.propButtonType = buttonType;
        return this;
    }

    public withIconClass(iconClass: string): DynamicActionBuilder<D> {
        this.propIconClass = iconClass;
        return this;
    }

    public withI18n(i18n: boolean): DynamicActionBuilder<D> {
        this.propI18n = !!i18n;
        return this;
    }

    public withPayload(payload: D): DynamicActionBuilder<D> {
        this.propPayload = payload;
        return this;
    }

    public withOrder(order: number): DynamicActionBuilder<D> {
        this.propOrder = order;
        return this;
    }

    public withChildsProvider(provider: (parent: GenericDynamicAction<D>) => Array<GenericDynamicAction<D>>): DynamicActionBuilder<D> {
        if (provider) {
            this.childsProvider = provider;
        }
        return this;
    }

    public build(): GenericDynamicAction<D> {
        const action = new GenericDynamicAction<D>(
            this.propId,
            this.propScopes,
            this.propType,
            this.propButtonType,
            this.handlerAction,
            this.propLabel,
            this.propBadge,
            this.propButtonClass,
            this.propIconClass,
            this.propI18n,
            this.propPayload
        );
        action.disabled = this.propDisabled;
        action.visible = this.propDisplay;
        action.order = this.propOrder <= 0 ? globalOrder++ : this.propOrder;

        const childs = this.childsProvider(action);
        if (childs) {
            childs.forEach(c => {
                action.addChild(c);
            });
            if (childs.length > 0 && action.buttonType === 'button') {
                action.buttonType = 'dropdown';
            }
        }
        return action;
    }
}
