import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fontAwesomeIcons } from '../icons/font-awesome-icons';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';

export class DynamicMissingTranslationHandler implements MissingTranslationHandler {
  constructor() {}

  handle(params: MissingTranslationHandlerParams) {
      const key = params.key;
      return `[${key}]`;
  }
}

export function translatePartialLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}

export function missingTranslationHandler() {
  return new DynamicMissingTranslationHandler();
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgxWebstorageModule.forRoot({ prefix: 'zee', separator: '-' }),
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
    })
  ],
  exports: [NgbModule, HttpClientModule, FontAwesomeModule, TranslateModule]
})
export class DynamicCoreModule { 
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIconPacks(fas);
    iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
