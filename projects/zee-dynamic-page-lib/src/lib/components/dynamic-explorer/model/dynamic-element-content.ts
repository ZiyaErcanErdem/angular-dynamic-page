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
    private _id: string | number;
    private _parent?: IDynamicElementContent<T>;
    private _index: number;
    private _sequence: number;

    public formatter?: IViewFormatter<T>;

    get id(): string | number {
        return this._id ? this._id : this.index;
    }

    set id(val: string | number) {
        this._id = val;
    }

    get parent(): IDynamicElementContent<T> {
        return this._parent;
    }

    set parent(val: IDynamicElementContent<T>) {
        this._parent = val;
        this.setup();
    }

    get index(): number {
        return this._index;
    }

    constructor(
        public type: string | number,
        id: string | number,
        public data: T,
        public parentType?: string | number,
        public parentId?: string | number
    ) {
        this._id = id;
        this._sequence = 0;
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
            this._sequence++;
            return this._sequence;
        }
    }

    private setup() {
        const curSequence = this.generateSequence();
        this._sequence = curSequence;
        this._index = this._sequence;
    }
}
