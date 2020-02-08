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
    protected _order: number;
    protected _label: string;
    protected _badge: string;
    protected _buttonClass: string;
    protected _iconClass: string;
    protected _display: boolean;
    protected _disabled: boolean;
    private _data: D;
    protected _i18n: boolean;
    protected _payload: D;
    protected _buttonType: 'button' | 'dropdown' | 'split';

    protected _origin: HTMLElement;

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
        this._label = label || label === '' ? label : '' + id;
        this._badge = badge;
        this._buttonClass = btnCls;
        this._buttonType = buttonType;
        this._iconClass = iconCls;
        this._display = true;
        this._disabled = false;
        this._order = 0;
        this.subject = new Subject<D>();
        this._i18n = i18n;
        this._payload = payload;
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
        this._data = undefined;
        this._payload = undefined;
        this.scopes = undefined;
    }

    public emit(data: D, origin?: HTMLElement): void {
        this._data = data ? data : this._payload;
        this._origin = origin;
        this.subject.next(this._data);
        this._origin = undefined;
    }

    public get order(): number {
        return this._order;
    }

    public get label(): string {
        return this._label;
    }

    public get badge(): string {
        return this._badge;
    }

    public get i18n(): boolean {
        return this._i18n;
    }

    public get payload(): D {
        return this._payload;
    }

    public get origin(): HTMLElement {
        return this._origin;
    }

    public get buttonClass(): string {
        return this._buttonClass;
    }

    public get iconClass(): string {
        return this._iconClass;
    }

    public get disabled(): boolean {
        return !!this._disabled;
    }

    public get visible(): boolean {
        return !!this._display;
    }

    public get data(): D {
        return this._data;
    }

    public get buttonType(): 'button' | 'dropdown' | 'split' {
        return this._buttonType;
    }

    public containsScope(scope: ActionScope): boolean {
        if (!scope) {
            return false;
        }
        return this.scopes.includes(scope);
    }
}

export class GenericDynamicAction<D> extends DynamicAction<D> {
    private _handler: (action: GenericDynamicAction<D>, data: D) => void;
    private _childs: Array<GenericDynamicAction<D>>;

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
        this._childs = new Array<GenericDynamicAction<D>>();
        this._handler = handler;
    }

    public get order(): number {
        return this._order;
    }

    public set order(value: number) {
        this._order = value;
    }

    public get label(): string {
        return this._label;
    }

    public set label(value: string) {
        this._label = value;
    }

    public get badge(): string {
        return this._badge;
    }

    public set badge(value: string) {
        this._badge = value;
    }
    public get buttonType(): 'button' | 'dropdown' | 'split' {
        return this._buttonType;
    }

    public set buttonType(value: 'button' | 'dropdown' | 'split') {
        this._buttonType = value;
    }

    public get buttonClass(): string {
        return this._buttonClass;
    }

    public set buttonClass(value: string) {
        this._buttonClass = value;
    }

    public get iconClass(): string {
        return this._iconClass;
    }

    public set iconClass(value: string) {
        this._iconClass = value;
    }

    public get disabled(): boolean {
        return !!this._disabled;
    }

    public set disabled(value: boolean) {
        this._disabled = !!value;
    }

    public get visible(): boolean {
        return !!this._display || this.childs.length > 0;
    }

    public set visible(value: boolean) {
        this._display = !!value;
    }

    public get i18n(): boolean {
        return !!this._i18n;
    }

    public set i18n(value: boolean) {
        this._i18n = !!value;
    }

    public get payload(): D {
        return this._payload;
    }

    public set payload(value: D) {
        this._payload = value;
    }

    public set handler(value: (action: GenericDynamicAction<D>, data: D) => void) {
        this._handler = value;
    }

    public get childs(): Array<DynamicAction<D>> {
        return this._childs.length === 0 ? this._childs : this._childs.filter(c => !c.disabled && c.visible);
    }

    public forEachChild(childIterator: (c: GenericDynamicAction<D>) => void): void {
        if (this._childs && childIterator) {
            this._childs.forEach(c => childIterator(c));
        }
    }

    protected handle(data: D) {
        // console.log('disabled: ' + this.disabled);
        // console.log('visible: ' + this.visible);
        if (this._handler) {
            this._handler(this, data);
        }
    }

    public hasChilds(): boolean {
        return this.childs && this.childs.length > 0;
    }

    public addChild(child: GenericDynamicAction<D>): void {
        if (!child || this._childs.some(c => c.id === child.id)) {
            return;
        }
        this._childs.push(child);
    }

    public destroyChilds(): void {
        if (this._childs) {
            this._childs.forEach(c => c.destroy());
            this._childs = [];
        }
    }

    public destroy(): void {
        super.destroy();
        this._handler = undefined;
        this.payload = undefined;
        if (this._childs) {
            this._childs.forEach(c => c.destroy());
            this._childs = undefined;
        }
    }
}

let globalOrder = 10000;
export class DynamicActionBuilder<D> {
    private _handler: (action: GenericDynamicAction<D>, data: D) => void;
    private _type: ActionType;
    private _scopes: Array<ActionScope>;
    private _id: string | number;
    private _label: string;
    private _badge: string;
    private _buttonClass: string;
    private _buttonType: 'button' | 'dropdown' | 'split' = 'button';
    private _iconClass: string;
    private _order = 0;
    private _display = true;
    private _disabled = false;
    private _i18n = true;
    private _payload: D = null;

    private _childsProvider: (parent: DynamicAction<D>) => Array<GenericDynamicAction<D>>;

    constructor(id: string | number, type: ActionType) {
        this._id = id;
        this._type = type;
        this._scopes = new Array<ActionScope>();
        this._handler = d => {};
        this._childsProvider = p => null;
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
            this._scopes = [...this._scopes, ...scopes];
        }
        return this;
    }

    public withHandler(handler: (action: GenericDynamicAction<D>, data: D) => void): DynamicActionBuilder<D> {
        this._handler = handler;
        return this;
    }

    public withLabel(label: string): DynamicActionBuilder<D> {
        this._label = label;
        return this;
    }

    public withBadge(badge: string): DynamicActionBuilder<D> {
        this._badge = badge;
        return this;
    }

    public withButtonClass(buttonClass: string): DynamicActionBuilder<D> {
        this._buttonClass = buttonClass;
        return this;
    }

    public withButtonType(buttonType: 'button' | 'dropdown' | 'split'): DynamicActionBuilder<D> {
        this._buttonType = buttonType;
        return this;
    }

    public withIconClass(iconClass: string): DynamicActionBuilder<D> {
        this._iconClass = iconClass;
        return this;
    }

    public withI18n(i18n: boolean): DynamicActionBuilder<D> {
        this._i18n = !!i18n;
        return this;
    }

    public withPayload(payload: D): DynamicActionBuilder<D> {
        this._payload = payload;
        return this;
    }

    public withOrder(order: number): DynamicActionBuilder<D> {
        this._order = order;
        return this;
    }

    public withChildsProvider(provider: (parent: GenericDynamicAction<D>) => Array<GenericDynamicAction<D>>): DynamicActionBuilder<D> {
        if (provider) {
            this._childsProvider = provider;
        }
        return this;
    }

    public build(): GenericDynamicAction<D> {
        const action = new GenericDynamicAction<D>(
            this._id,
            this._scopes,
            this._type,
            this._buttonType,
            this._handler,
            this._label,
            this._badge,
            this._buttonClass,
            this._iconClass,
            this._i18n,
            this._payload
        );
        action.disabled = this._disabled;
        action.visible = this._display;
        action.order = this._order <= 0 ? globalOrder++ : this._order;

        const childs = this._childsProvider(action);
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
