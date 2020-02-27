import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicNotifierComponent } from './dynamic-notifier.component';
import { DynamicAlertManagerService } from '../../services/dynamic-alert-manager.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DynamicAlertModule } from '../dynamic-alert/dynamic-alert.module';

describe('DynamicNotifierComponent', () => {
  let component: DynamicNotifierComponent;
  let fixture: ComponentFixture<DynamicNotifierComponent>;
  let service: DynamicAlertManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicAlertModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicNotifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicNotifierComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DynamicAlertManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen alert manager', () => {
    const notifierDe: DebugElement = fixture.debugElement;
    const alert1 = service.alert({msg: 'Alert_1', params: {param: 'a'}, i18n: true});
    service.error({msg: 'Error_1', params: {param: 'e'}, i18n: true});
    service.info({msg: 'Info_1', params: {param: 'i'}, i18n: true});
    service.warning({msg: 'Warning_1', params: {param: 'w'}, i18n: true});

    fixture.detectChanges();
    let alerts = notifierDe.queryAll(By.css('zee-dynamic-alert'));
    expect(alerts.length).toEqual(4);

    service.closeAlert(alert1.id);
    fixture.detectChanges();
    alerts = notifierDe.queryAll(By.css('zee-dynamic-alert'));
    expect(alerts.length).toEqual(3);

    service.clear();
    fixture.detectChanges();
    alerts = notifierDe.queryAll(By.css('zee-dynamic-alert'));
    expect(alerts.length).toEqual(0);
  });
});
