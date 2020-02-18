import { Injectable } from '@angular/core';
import { PageMetamodel } from '../model/page-metamodel';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicDateParserService } from './dynamic-date-parser.service';
import { DynamicConfigService } from './dynamic-config.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DynamicMetamodelService {
  private microserviceName = '';
  private serverApiUrl = '/';
  private dynamicMetamodelPath = '/dynamic/metamodel';

  private cache: Map<string, PageMetamodel>;

  constructor(
    private appConfigService: DynamicConfigService, 
    private http: HttpClient, 
    private dateUtils: DynamicDateParserService
  ) {
    this.microserviceName = this.appConfigService.getConfig().microserviceName;
    this.serverApiUrl = this.appConfigService.getConfig().serverApiUrl || '/';
    this.cache = new Map<string, PageMetamodel>();
  }

  private apiUriOf(microservice?: string): string {
    if (this.microserviceName || microservice) {
      return `${this.serverApiUrl}services/${microservice ? microservice : this.microserviceName}/api`;
    } else {
      return `${this.serverApiUrl}api`;
    }    
  }

  private cacheMetamodel(model: PageMetamodel, microservice?: string): void {
    if (!model || !model.qualifier) {
      return;
    }
    microservice = microservice ? microservice : 'default';
    const cacheKey = `${microservice}.${model.qualifier}`;
    this.cache.set(cacheKey, model);
  }

  public getCachedMetamodel(qualifier: string, microservice?: string): PageMetamodel {
    if (!qualifier) {
      return undefined;
    }
    microservice = microservice ? microservice : 'default';
    const cacheKey = `${microservice}.${qualifier}`;
    const cached = this.cache.get(cacheKey);
    return this.convert(cached);
  }

  public metadataOf(qualifier: string, microservice?: string, metamodelPathPrefix = ''): Observable<HttpResponse<PageMetamodel>> {
    const dynamicUrl = this.apiUriOf(microservice);
    metamodelPathPrefix = metamodelPathPrefix ? metamodelPathPrefix : '';
    return this.http
      .get<PageMetamodel>(`${dynamicUrl}${metamodelPathPrefix}${this.dynamicMetamodelPath}/${qualifier}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<PageMetamodel>) => this.convertResponse(res, microservice)));
  }

  private convertResponse(res: HttpResponse<PageMetamodel>, microservice?: string): HttpResponse<PageMetamodel> {
    // this.cacheMetamodel(res.body, microservice);
    const body: PageMetamodel = this.convert(res.body);
    this.cacheMetamodel(body, microservice);
    return res.clone({ body });
  }
  /**
   * Convert a returned JSON object to PageMetamodel.
   */
  private convert(qmd: PageMetamodel): PageMetamodel {
    if (!qmd || !!qmd.parent) {
      return qmd;
    }
    const copy: PageMetamodel = new PageMetamodel(qmd, null);
    return copy;
  }
}

