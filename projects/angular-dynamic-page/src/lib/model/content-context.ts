
export class ContentContext {
    public viewScope: Array<string>;
    constructor(
        public readonly qualifier: string,
        public readonly i18nPrefix: string,
        public readonly i18nAppName: string,
        public readonly appPathPrefix: string,
        public readonly microserviceName: string,
        public readonly contentType: string | number,
        public readonly entity: any
    ) {
        this.viewScope = new Array<string>();
    }

    public setViewScope(...paths: string[]): void {
        this.viewScope = [...paths];
    }
}
