import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { DynamicPageComponent } from './dynamic-page.component';
import {
  prepareDynamicTestImports,
  prepareDynamicTestProviders,
  createSamplePageManager
} from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';
import { getSampleEndpointData, getSampleEndpointMetamodelData } from '../../test/dynamic-test-data';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { DynamicPageActionsModule } from '../dynamic-page-actions/dynamic-page-actions.module';
import { DynamicGridModule } from '../dynamic-grid/dynamic-grid.module';
import { DynamicPortalModule } from '../dynamic-portal/dynamic-portal.module';
import { DynamicContentViewModule } from '../dynamic-content-view/dynamic-content-view.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';
import { DynamicExcelModule } from '../dynamic-excel/dynamic-excel.module';
import { DynamicPopoverModule } from '../dynamic-popover/dynamic-popover.module';
import { DynamicNotifierModule } from '../dynamic-notifier/dynamic-notifier.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DynamicPageComponent', () => {
  let component: DynamicPageComponent;
  let fixture: ComponentFixture<DynamicPageComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicPanelModule,
        DynamicPageActionsModule,
        DynamicGridModule,
        DynamicPortalModule,
        DynamicContentViewModule,
        DynamicButtonModule,
        DynamicExcelModule,
        DynamicPopoverModule,
        DynamicNotifierModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPageComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search with given qualifier', () => {
    const qualifier = 'Endpoint';
    const config = dynamicService.getConfig();

    const testData = getSampleEndpointData();
    const dataURI = `${config.serverApiUrl}api/dynamic/search/${qualifier}?search=&page=0&size=10&sort=id,desc`;

    const testMetamodelData = getSampleEndpointMetamodelData();
    const metamodelURI = `${config.serverApiUrl}api/dynamic/metamodel/${qualifier}`;
    const httpTestingController = TestBed.inject(HttpTestingController);

    component.title = 'Test Page';

    fixture.detectChanges();

    const metamodelReq = httpTestingController.expectOne(metamodelURI);
    expect(metamodelReq.request.method).toEqual('GET');
    metamodelReq.flush(testMetamodelData);

    fixture.detectChanges();

    const dataReq = httpTestingController.expectOne(dataURI);
    expect(dataReq.request.method).toEqual('GET');
    dataReq.flush(testData);

    fixture.detectChanges();

    component.manager.ready().subscribe(isReady => {
      if (isReady) {
        Promise.resolve(null).then(() => {
          fixture.detectChanges();
          const dynamicPageDe: DebugElement = fixture.debugElement;

          const notifierDe = dynamicPageDe.query(By.css('zee-dynamic-notifier'));
          expect(notifierDe).toBeTruthy();
      });
      }
    });

    httpTestingController.verify();

  });
});
