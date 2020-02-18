import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export type ElementView = TemplateRef<any> | ComponentType<any> | string;

export interface IContentChangeListener<T> {
    created(type: string | number, data: T): void;
    updated(type: string | number, data: T): void;
    deleted(type: string | number, data: T): void;
}

export interface IViewFormatter<T> {
    label?: string;
    extractor?: (val: IDynamicElementContent<T>) => string;
}

export interface IDynamicElementContent<T> {
    id?: string | number;
    data: T;
    parentType?: string | number;
    parentId?: string | number;
    type: string | number;
    parent?: IDynamicElementContent<T>;
    index: number;
    formatter?: IViewFormatter<T>;

    sequence(): number;
    destroy(): void;
}

export class DynamicElementContent<T> implements IDynamicElementContent<T> {
    private elementId: string | number;
    private elementParent?: IDynamicElementContent<T>;
    private elementIndex: number;
    private elementSequence: number;

    public formatter?: IViewFormatter<T>;

    get id(): string | number {
        return this.elementId ? this.elementId : this.index;
    }

    set id(val: string | number) {
        this.elementId = val;
    }

    get parent(): IDynamicElementContent<T> {
        return this.elementParent;
    }

    set parent(val: IDynamicElementContent<T>) {
        this.elementParent = val;
        this.setup();
    }

    get index(): number {
        return this.elementIndex;
    }

    constructor(
        public type: string | number,
        id: string | number,
        public data: T,
        public parentType?: string | number,
        public parentId?: string | number
    ) {
        this.elementId = id;
        this.elementSequence = 0;
        this.setup();
    }

    public sequence(): number {
        return this.generateSequence();
    }

    public destroy(): void {
        this.parent = undefined;
        this.data = undefined;
        this.formatter = undefined;
    }

    private generateSequence(): number {
        if (this.parent) {
            return this.parent.sequence();
        } else {
            this.elementSequence++;
            return this.elementSequence;
        }
    }

    private setup() {
        const curSequence = this.generateSequence();
        this.elementSequence = curSequence;
        this.elementIndex = this.elementSequence;
    }
}
