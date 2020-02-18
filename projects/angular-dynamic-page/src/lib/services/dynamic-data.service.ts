import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpParams, HttpEvent } from '@angular/common/http';
import { PageRelation } from '../model/page-relation';
import { Observable } from 'rxjs';
import { DynamicAuthorizableSearchRequest, DynamicAuthorizedSearchResponse } from '../model/dynamic-authorizable-search-request';
import { DynamicLinkParserService } from './dynamic-link-parser.service';
import { DynamicDateParserService } from './dynamic-date-parser.service';
import { DynamicConfigService } from './dynamic-config.service';
import { map } from 'rxjs/operators';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      req.sort.forEach(val => {
        options = options.append('sort', val);
      });
    }
  }
  return options;
};

@Injectable({
  providedIn: 'root'
})
export class DynamicDataService {
  private microserviceName = '';
  private serverApiUrl = '/';
  private dynamicSearchPath = '';
  private dynamicExcelPath = '';

  constructor(
    private appConfigService: DynamicConfigService, 
    private http: HttpClient, 
    private linkParser: DynamicLinkParserService, 
    public dateUtils: DynamicDateParserService
  ) {
    this.microserviceName = this.appConfigService.getConfig().microserviceName;
    this.serverApiUrl = this.appConfigService.getConfig().serverApiUrl || '/';
    this.dynamicSearchPath = `/dynamic/search`;
    this.dynamicExcelPath = `/dynamic/excel`;

  }

  private apiUriOf(microservice?: string): string {
    console.log(this.serverApiUrl);
    if (this.microserviceName || microservice) {
      return `${this.serverApiUrl}services/${microservice ? microservice : this.microserviceName}/api`;
    } else {
      return `${this.serverApiUrl}api`;
    }  
  }

  createEntity<T>(relation: PageRelation, entity: T, microservice?: string): Observable<HttpResponse<T>> {
    if (entity && relation && relation.metamodel && relation.metamodel.key) {
      const idAttr = relation.metamodel.key;
      delete entity[idAttr];
    }
    const dynamicUrl = this.apiUriOf(microservice);
    const copy = this.convert(entity);

    return this.http
      .post<T>(`${dynamicUrl}/${relation.accessPath}`, copy, { observe: 'response' })
      .pipe(map((res: HttpResponse<T>) => this.convertResponse(res)));
  }

  updateEntity<T>(relation: PageRelation, entity: T, microservice?: string): Observable<HttpResponse<T>> {
    const dynamicUrl = this.apiUriOf(microservice);
    const copy = this.convert(entity);
    return this.http
      .put<T>(`${dynamicUrl}/${relation.accessPath}`, copy, { observe: 'response' })
      .pipe(map((res: HttpResponse<T>) => this.convertResponse(res)));
  }

  findEntity<R>(relation: PageRelation, id: number, microservice?: string): Observable<HttpResponse<R>> {
    const dynamicUrl = this.apiUriOf(microservice);
    return this.http
      .get<R>(`${dynamicUrl}/${relation.accessPath}/${id}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<R>) => this.convertResponse(res)));
  }

  findAllEntities<R>(relation: PageRelation, req?: any, microservice?: string): Observable<HttpResponse<Array<R>>> {
    const dynamicUrl = this.apiUriOf(microservice);
    const options = createRequestOption(req);
    return this.http
      .get<Array<R>>(`${dynamicUrl}/${relation.accessPath}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<Array<R>>) => this.convertArrayResponse(res)));
  }

  deleteEntity<T>(relation: PageRelation, id: number, microservice?: string): Observable<HttpResponse<any>> {
    const dynamicUrl = this.apiUriOf(microservice);
    return this.http.delete<any>(`${dynamicUrl}/${relation.accessPath}/${id}`, { observe: 'response' });
  }

  public parseLink(header: string): any {
    return this.linkParser.parse(header);
  }

  /*
    query<T>(qualifier: string, dynamicPathPrefix = '', req?: any, modifier?: (d: T) => void): Observable<HttpResponse<T[]>> {
        const dynamicUrl = this.apiUriOf();
        const options = createRequestOption(req);
        dynamicPathPrefix = dynamicPathPrefix ? dynamicPathPrefix : '';
        return this.http
            .get<T[]>(`${dynamicUrl}${dynamicPathPrefix}${this.dynamicSearchPath}/${qualifier}`, { params: options, observe: 'response' })
            .pipe(map((res: HttpResponse<T[]>) => this.convertArrayResponse<T>(res, modifier)));
    }*/

  public search<T>(qualifier: string, dynamicPathPrefix = '', microservice?: string, req?: any, modifier?: (d: T) => void): Observable<HttpResponse<T[]>> {
    const dynamicUrl = this.apiUriOf(microservice);
    const options = createRequestOption(req);
    dynamicPathPrefix = dynamicPathPrefix ? dynamicPathPrefix : '';
    return this.http
      .get<T[]>(`${dynamicUrl}${dynamicPathPrefix}${this.dynamicSearchPath}/${qualifier}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<T[]>) => this.convertArrayResponse(res, modifier)));
  }

  public authorizedSearch<T, A>(
    ctx: DynamicAuthorizableSearchRequest,
    microservice?: string,
    req?: any,
    modifier?: (d: T) => void
  ): Observable<HttpResponse<DynamicAuthorizedSearchResponse<T, A>>> {
    const dynamicUrl = this.apiUriOf(microservice);
    const qualifier = ctx.qualifier;
    const options = createRequestOption(req);
    const dynamicPathPrefix = ctx.provider ? ctx.provider : '';
    const reqURI = `${dynamicUrl}${dynamicPathPrefix}${this.dynamicSearchPath}/${qualifier}`;
    const payload = this.serializeDynamicAuthorizableSearchRequest(ctx);
    return this.http
      .post<DynamicAuthorizedSearchResponse<T, A>>(reqURI, payload, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<DynamicAuthorizedSearchResponse<T, A>>) => this.convertAuthorizedResponse(res, modifier)));
  }

  public importExcelData(qualifier: string, formData: FormData, microservice?: string): Observable<HttpEvent<{}>> {
    const dynamicUrl = this.apiUriOf(microservice);
    const url = `${dynamicUrl}${this.dynamicExcelPath}/import/${qualifier}`;
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'blob' as 'json'
    });

    return this.http.request(req);
  }

  public async exportExcelTemplate(qualifier: string, req?: any, microservice?: string): Promise<Blob> {
    const dynamicUrl = this.apiUriOf(microservice);
    const options = createRequestOption(req);
    const resource = await this.http
      .get<Blob>(`${dynamicUrl}${this.dynamicExcelPath}/template/${qualifier}`, {
        params: options,
        observe: 'body',
        responseType: 'blob' as 'json'
      })
      .toPromise();

    return resource;
  }

  public async exportExcelData(qualifier: string, req?: any, microservice?: string): Promise<Blob> {
    const dynamicUrl = this.apiUriOf(microservice);
    const options = createRequestOption(req);
    const resource = await this.http
      .get<Blob>(`${dynamicUrl}${this.dynamicExcelPath}/export/${qualifier}`, {
        params: options,
        observe: 'body',
        responseType: 'blob' as 'json'
      })
      .toPromise();

    return resource;
  }

  public async exportResource(resourceUri: string, req?: any): Promise<Blob> {
    const options = createRequestOption(req);
    const resource = await this.http
      .get<Blob>(`${resourceUri}`, { params: options, observe: 'body', responseType: 'blob' as 'json' })
      .toPromise();

    return resource;
  }

  public writeBlobAsResource(blob: Blob, fileName: string, elmLink: ElementRef): void {
    if (!blob || !fileName || !elmLink || !elmLink.nativeElement) {
      return;
    }
    const link = elmLink.nativeElement;
    const objectURI = window.URL.createObjectURL(blob);
    link.href = objectURI;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(objectURI);
  }

  private serializeDynamicAuthorizableSearchRequest(ctx: DynamicAuthorizableSearchRequest): any {
    if (ctx) {
      const prms = {};
      if (ctx.authContext) {
        ctx.authContext.forEach((value, key) => (prms[key] = value));
      }
      return {
        qualifier: ctx.qualifier,
        query: ctx.query,
        provider: ctx.provider,
        authContext: prms
      };
    }
    return {};
  }

  private convertAuthorizedResponse<T, A>(
    res: HttpResponse<DynamicAuthorizedSearchResponse<T, A>>,
    modifier?: (d: T) => void
  ): HttpResponse<DynamicAuthorizedSearchResponse<T, A>> {
    const body: DynamicAuthorizedSearchResponse<T, A> = {
      qualifier: res.body.qualifier,
      content: this.convertArray<T>(res.body.content, modifier),
      authMap: this.convertMap(res.body.authMap)
    };
    return res.clone({ body });
  }

  private convertResponse<T>(res: HttpResponse<T>, modifier?: (d: T) => void): HttpResponse<T> {
    const body: T = this.convertItemFromServer<T>(res.body, modifier);
    return res.clone({ body });
  }

  private convertArrayResponse<T>(res: HttpResponse<T[]>, modifier?: (d: T) => void): HttpResponse<T[]> {
    const jsonResponse: T[] = res.body;
    const body = this.convertArray<T>(res.body, modifier);
    return res.clone({ body });
  }

  private convertArray<T>(input: T[], modifier?: (d: T) => void): T[] {
    const output: T[] = [];
    if (!input) {
      return output;
    }
    for (let i = 0; i < input.length; i++) {
      output.push(this.convertItemFromServer<T>(input[i], modifier));
    }
    return output;
  }

  private convertMap(input: object): Map<any, any> {
    const output: Map<any, any> = new Map<any, any>();
    if (!input) {
      return output;
    }
    Object.keys(input).forEach(key => {
      const mapKey = parseInt(key, 10);
      if (isNaN(mapKey)) {
        return;
      }
      output.set(mapKey, input[key]);
    });
    return output;
  }

  private convertItemFromServer<T>(data: T, modifier?: (d: T) => void): T {
    const copy: T = Object.assign({}, data);
    if (modifier) {
      modifier(copy);
    }
    return copy;
  }

  private convert<T>(data: T): T {
    const copy: T = Object.assign({}, data);
    return copy;
  }
}

