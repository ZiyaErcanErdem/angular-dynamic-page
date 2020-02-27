import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAlertComponent } from './dynamic-alert.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';

describe('DynamicAlertComponent', () => {
  let component: DynamicAlertComponent;
  let fixture: ComponentFixture<DynamicAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports()
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dismissible alerts should render close button', () => {
     component.dismissible = true;

    fixture.detectChanges();

    const alertDe: DebugElement = fixture.debugElement;
    const buttonDe = alertDe.query(By.css('.js-alert-button'));
    expect(buttonDe).toBeTruthy();
  });

  it('non-dismissible alerts should not render close button', () => {
    component.dismissible = false;

   fixture.detectChanges();

   const alertDe: DebugElement = fixture.debugElement;
   const buttonDe = alertDe.query(By.css('.js-alert-button'));
   expect(buttonDe).toBeFalsy();
 });

  it('dismissible alerts should emit alertClose event', () => {
    let closed = false;
    component.dismissible = true;

    fixture.detectChanges();

    component.alertClose.subscribe(() => {
      expect(closed).toBe(true);
    })

    const alertDe: DebugElement = fixture.debugElement;
    const buttonDe = alertDe.query(By.css('.js-alert-button'));
    closed = true;
    buttonDe.triggerEventHandler('click', {});
    
    fixture.detectChanges();
  });

  it('alerts should set given alert type', () => {
    component.type = 'danger';

   fixture.detectChanges();

   const alertDe: DebugElement = fixture.debugElement;
   const themeDe = alertDe.query(By.css('.alert-danger'));
   expect(themeDe).toBeTruthy();
 });

});
