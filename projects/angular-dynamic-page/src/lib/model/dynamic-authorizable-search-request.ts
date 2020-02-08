export class DynamicAuthorizableSearchRequest {
    public authContext: Map<string, string>;
    public provider: string;
    public readonly qualifier: string;
    public readonly query: string;

    constructor(public readonly prmQualifier: string, public readonly prmQuery: string) {
        this.qualifier = prmQualifier;
        this.prmQuery = prmQuery;
        this.authContext = new Map<string, string>();
    }
}

export interface DynamicAuthorizedSearchResponse<T, A> {
    qualifier: string;
    content: Array<T>;
    authMap: Map<number, A>;
}
