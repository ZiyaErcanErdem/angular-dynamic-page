import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { provideDynamicConfigRegistryToken, prepareDynamicTestImports } from 'projects/angular-dynamic-page/src/lib/test/dynamic-test-util';
import { PageTaskComponent } from './page-task/page-task.component';
import { PageFlowComponent } from './page-flow/page-flow.component';
import {
  DynamicPanelModule,
  DynamicButtonModule,
  DynamicTableModule,
  DynamicPageModule
} from 'projects/angular-dynamic-page/src/public-api';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        RouterTestingModule,
        DynamicPanelModule,
        DynamicButtonModule,
        DynamicTableModule,
        DynamicPageModule,
      ],
      declarations: [
        AppComponent,
        PageTaskComponent,
        PageFlowComponent
      ],
      providers: [
        provideDynamicConfigRegistryToken(),
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'dynamic-showcase-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('dynamic-showcase-app');
  });

});
