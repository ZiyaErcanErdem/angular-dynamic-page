export class DynamicEvent<T> {

    constructor(public name: string, public payload: T) {}

    public static create<T>(name: string, payload?: T): DynamicEvent<T> {
        return new DynamicEvent<T>(name, payload);
    }
}
