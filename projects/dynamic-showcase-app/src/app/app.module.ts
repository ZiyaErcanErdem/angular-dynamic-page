import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicPanelModule, DynamicEditorModule } from 'zee-dynamic-page-lib';
import { DynamicButtonModule } from 'zee-dynamic-page-lib';
import { DynamicTableModule } from 'zee-dynamic-page-lib';
import { DynamicGridModule } from 'zee-dynamic-page-lib';
import { DynamicPageModule } from 'zee-dynamic-page-lib';
import { DynamicModule } from 'zee-dynamic-page-lib';
import { DynamicCoreModule } from 'zee-dynamic-page-lib';
import { DynamicPortalModule } from 'zee-dynamic-page-lib';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
    AppComponent
  ],
  imports: [
    BrowserModule,
    /*
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
    */
    DynamicCoreModule,
    DynamicModule.forRoot({
      defaultAppId: 'Corecon',
      registries: [
        {
          serverApiUrl: 'http://localhost:8590/',
          applicationId: 'Corecon',
          i18nPrefix: '',
          i18nAppName: '',
          appPathPrefix: ''
        }
      ]
    }),
    DynamicPanelModule,
    DynamicButtonModule,
    DynamicTableModule,
    DynamicGridModule,
    DynamicPageModule,
    DynamicPortalModule,
    DynamicEditorModule,    
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
