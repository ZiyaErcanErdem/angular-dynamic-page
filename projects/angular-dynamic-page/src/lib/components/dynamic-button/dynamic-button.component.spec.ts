import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicButtonComponent } from './dynamic-button.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DebugElement } from '@angular/core';
import { DynamicActionBuilder, ActionScope, ActionType, DynamicAction } from '../../model/dynamic-action';
import { DynamicUtil } from '../../model/dynamic-util';
import { Theme } from '../../model/theme.enum';
import { By } from '@angular/platform-browser';

describe('DynamicButtonComponent', () => {
  let component: DynamicButtonComponent;
  let fixture: ComponentFixture<DynamicButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicButtonComponent ],
      imports: [
        ...prepareDynamicTestImports(),
      ],
      providers: [
        ...prepareDynamicTestProviders(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render given action as button', () => {
    const action: DynamicAction<any> = new DynamicActionBuilder<any>('dummy.action', ActionType.CUSTOM)
    .withScope(ActionScope.CUSTOM)
    .withLabel('Test')
    .withI18n(false)
    .withButtonClass(DynamicUtil.buttonThemeFor(Theme.danger))
    .withIconClass('filter')
    .withPayload('test payload')
    .build();

    component.action = action;
    const dynamicButtonDe: DebugElement = fixture.debugElement;

    fixture.detectChanges();
    let buttons = dynamicButtonDe.queryAll(By.css('button'));
    expect(buttons.length).toEqual(1);
  });

  it('should emit click event to action', () => {
    let actionPayload = null;
    const testPayload = 'test payload';
    const action: DynamicAction<any> = new DynamicActionBuilder<any>('dummy.action', ActionType.CUSTOM)
    .withScope(ActionScope.CUSTOM)
    .withLabel('Test')
    .withI18n(false)
    .withButtonClass(DynamicUtil.buttonThemeFor(Theme.danger))
    .withIconClass('filter')
    .withPayload(testPayload)
    .withHandler((comp, payload) => {
        actionPayload = payload;
    })
    .build();

    component.action = action;
    const dynamicButtonDe: DebugElement = fixture.debugElement;

    fixture.detectChanges();
    let buttons = dynamicButtonDe.queryAll(By.css('button'));
    buttons[0].triggerEventHandler('click', {})

    fixture.detectChanges();
    expect(actionPayload).toEqual(testPayload);
  });
});
