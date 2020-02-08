export interface DynamicDataAuthorizer<T, A> {
    createAutrozitonContext(): Map<string, string>;
    getAuthorizationMap(): Map<number, A>;
    setAuthorizationMap(authMap: Map<number, A>): void;
    getAuthorizationFor(source: T): A;
    authorize(source: T, auth: A): T;
    authorizeAll(source: T[], authMap: Map<number, A>): T[];
}
