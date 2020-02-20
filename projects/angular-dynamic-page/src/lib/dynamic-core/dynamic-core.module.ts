import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fontAwesomeIcons } from '../icons/font-awesome-icons';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule,
    FlexLayoutModule,
    NgxWebstorageModule.forRoot({ prefix: 'zee', separator: '-' }),
  ],
  exports: [
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DynamicCoreModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIconPacks(fas);
    iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
