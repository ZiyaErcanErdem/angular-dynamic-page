import { DynamicRegistryConfiguration, DynamicConfigService } from '../services/dynamic-config.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { DynamicCoreModule } from '../dynamic-core/dynamic-core.module';
import { DynamicModule } from '../dynamic/dynamic.module';
import { ReplaySubject, Observable, of } from 'rxjs';
import { ParamMap, Params, convertToParamMap, Data, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { translatePartialLoader, missingTranslationHandler } from 'projects/dynamic-showcase-app/src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDynamicStorageProvider, PageManager } from '../model/page-manager';
import { IDynamicConfig } from '../model/dynamic-config';
import { DynamicPageManager } from '../model/dynamic-page-manager';
import { QueryMode } from '../model/query-mode.enum';
import { DataActionType } from '../model/data-action-type.enum';
import { Condition } from '../model/condition.enum';
import { Operator } from '../model/operator.enum';
import { PageViewMode } from '../model/page-view-mode.enum';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

export class ActivatedRouteStub {
    private subject = new ReplaySubject<ParamMap>();
    public url: string;

    public get data(): Observable<Data> {
        return of();
    }

    constructor(initialParams?: Params) {
      this.setParamMap(initialParams);
      this.url = 'http://localhost:8080';
    }

    readonly paramMap = this.subject.asObservable();

    setParamMap(params?: Params) {
      this.subject.next(convertToParamMap(params));
    }
  }

export function createRouterSpy() {
    return jasmine.createSpyObj('Router', ['navigate']);
}

export function prepareSampleDynamicConfig(): IDynamicConfig {
    return {
        serverApiUrl: 'http://localhost:8590/',
        applicationId: 'Zeemon',
        i18nPrefix: 'zeemonApp',
        i18nAppName: '',
        appPathPrefix: ''
    };
}

export function prepareDynamicRegistryConfiguration(): DynamicRegistryConfiguration {
    return {
        defaultAppId: 'Zeemon',
        registries: [
            prepareSampleDynamicConfig()
        ]
    };
}


export function provideDynamicConfigRegistryToken(): any {
    return {
        provide: 'DynamicConfigRegistryToken',
        useValue: prepareDynamicRegistryConfiguration()
    };
}

export function provideDynamicDependencies(): any[] {
    return [
        LocalStorageService,
        Overlay,
        HttpClient,
        provideDynamicConfigRegistryToken()
    ];
}

export function prepareDynamicTestImports(): any[] {
    return [
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: translatePartialLoader,
              deps: [HttpClient]
            },
            missingTranslationHandler: {
              provide: MissingTranslationHandler,
              useFactory: missingTranslationHandler,
              deps: []
            },
            isolate: false
          }),
        DynamicCoreModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        DynamicModule.forRoot(prepareDynamicRegistryConfiguration())
    ];
}

export function prepareDynamicTestProviders(): any[] {
    return [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router,         useValue: createRouterSpy()},
    ];
}

export function  createSamplePageManager(dynamicConfigService: DynamicConfigService): PageManager<any> {
    const qualifier = 'Endpoint';
    const appId = null;
    const storageProvider: IDynamicStorageProvider = dynamicConfigService.getStorageProvider();
    const dynamicConfig: IDynamicConfig = dynamicConfigService.getConfig(appId);

    const pageManager: PageManager<any> = new DynamicPageManager<any>(qualifier, dynamicConfig);
    pageManager.withStorageProvider(storageProvider);

    pageManager
    // .withSortingSample(Endpoint)
    .withGridColumns('id', 'endpointName', 'endpointInstanceId', 'endpointType', 'endpointSpec')
    .withCompactColumns('id', 'endpointName')
    .withPageConfiguration(config => {
      config.queryMode = QueryMode.CRITERIA;
      config.itemsPerPage = 10;
      config.canDownloadExcel = true;
      config.canUploadExcel = true;
      // config.pageTheme = this.theme;
      return config;
    })
    .withDataActionController((a, d) => {
      if (a === DataActionType.BEFORE_DELETE) {
        return pageManager.openConfirmation(
          'Alooo Endpoint Silinecek. Okey Mi?',
          {title: 'Onay Istiyorum',
          i18n: false, minWidth: '500px'}
        );
      }
      return Promise.resolve(true);
    })
    .withMetamodelConfiguration(cmd => {
      if (cmd.name === 'id') {
        cmd.gridColWith = '80px';
        cmd.compactColWidth = '50px';
      }
    })
    .withRelationConfiguration(relation => {
      if (relation.group === 'endpointProperty') {
          relation.accessPath = 'endpoint-properties';
          relation.descriptionColumnName = 'propertyName';

          pageManager
              .createRelationPageManager(relation)
              .withGridColumns('id', 'propKey', 'propKeyType', 'propValue', 'propValueType')
              .withCompactColumns('id', 'propKey');
              // .withSortingSamples(EndpointProperty);
      } else if (relation.group === 'endpoint') {
        relation.accessPath = 'endpoints';
        relation.descriptionColumnName = 'endpointName';
      } else {
        if (relation.qualifier !== 'ActionScript' && relation.qualifier !== 'CheckScript') {
          relation.searchable = true;
        }
      }
      return relation;
    })
    .withDefaultQuery(query => {
      query
        .withCondition(Condition.AND)
        .addPredicate('endpointName', Operator.LIKE, '')
        .and()
        .addPredicate('endpointInstanceId', Operator.LIKE, '')
        .and();
    })
    .withViewer(PageViewMode.EDITOR);
    return pageManager;
  }

