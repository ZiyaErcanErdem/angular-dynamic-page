import { TemplateType } from './template-type.enum';
import { Predicate } from '../../../model/predicate';


export class TemplateContext {
    private templateMap: Map<TemplateType, any>;
    private contextCache: Map<TemplateType, Map<Predicate, any>>;
    private actionContext: any;

    constructor() {
        this.templateMap = new Map<TemplateType, any>();
        this.contextCache = new Map<TemplateType, Map<Predicate, any>>();
    }

    public setTemplate(type: TemplateType, template: any): void {
        this.templateMap.set(type, template);
    }

    public getTemplate(type: TemplateType): any {
        return this.templateMap.get(type);
    }

    public setContext(type: TemplateType, predicate: Predicate, context: any): void {
        let cache = this.contextCache.get(type);
        if (!cache) {
            cache = new Map<Predicate, any>();
            this.contextCache.set(type, cache);
        }
        cache.set(predicate, context);
    }

    public hasContext(type: TemplateType, predicate: Predicate): any {
        const cache = this.contextCache.get(type);
        if (!cache) {
            return false;
        }
        cache.has(predicate);
    }

    public getContext(type: TemplateType, predicate: Predicate): any {
        let cache = this.contextCache.get(type);
        if (!cache) {
            cache = new Map<Predicate, any>();
            this.contextCache.set(type, cache);
            return undefined;
        }
        return cache.get(predicate);
    }

    public deleteContext(type: TemplateType, predicate: Predicate): void {
        const cache = this.contextCache.get(type);
        if (!cache) {
            return;
        }
        cache.delete(predicate);
    }

    public deletePredicate(predicate: Predicate): void {
        this.deleteContext(TemplateType.Input, predicate);
        this.deleteContext(TemplateType.Operator, predicate);
        this.deleteContext(TemplateType.Field, predicate);
        this.deleteContext(TemplateType.RemovePredicate, predicate);
    }

    public setActionContext(context: any): void {
        this.actionContext = context;
    }

    public hasActionContext(): any {
        if (!this.actionContext) {
            return true;
        }
        return false;
    }

    public getActionContext(): any {
        return this.actionContext;
    }

    public deleteActionContext(): any {
        this.actionContext = null;
    }
}
