import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicPanelModule } from 'angular-dynamic-page';
import { DynamicButtonModule } from 'angular-dynamic-page';
import { DynamicTableModule } from 'angular-dynamic-page';
import { DynamicPageModule } from 'angular-dynamic-page';
import { DynamicModule } from 'angular-dynamic-page';
import { DynamicCoreModule } from 'angular-dynamic-page';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PageTaskComponent } from './page-task/page-task.component';
import { PageFlowComponent } from './page-flow/page-flow.component';

export class DynamicMissingTranslationHandler implements MissingTranslationHandler {
  constructor() {}

  handle(params: MissingTranslationHandlerParams) {
      const key = params.key;
      return `i18n-not-found[${key}]`;
  }
}

export function translatePartialLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', `.json`);
}

export function missingTranslationHandler() {
  return new DynamicMissingTranslationHandler();
}

@NgModule({
  declarations: [
    AppComponent,
    PageTaskComponent,
    PageFlowComponent
  ],
  imports: [
    BrowserModule,
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
    DynamicModule.forRoot({
      defaultAppId: 'Zeemon',
      registries: [
        {
          serverApiUrl: 'http://localhost:8590/',
          applicationId: 'Zeemon',
          i18nPrefix: 'zeemonApp',
          i18nAppName: '',
          appPathPrefix: ''
        }
      ]
    }),
    DynamicPanelModule,
    DynamicButtonModule,
    DynamicTableModule,
    DynamicPageModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
