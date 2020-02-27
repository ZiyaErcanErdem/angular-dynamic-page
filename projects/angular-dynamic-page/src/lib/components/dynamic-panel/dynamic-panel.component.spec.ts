import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPanelComponent } from './dynamic-panel.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { Theme } from '../../model/theme.enum';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PanelState } from '../../model/panel-state.enum';

describe('DynamicPanelComponent', () => {
  let component: DynamicPanelComponent;
  let fixture: ComponentFixture<DynamicPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPanelComponent ],
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
    fixture = TestBed.createComponent(DynamicPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set given title', () => {
    const givenTitle = 'dummy title';
    component.title = givenTitle;

    fixture.detectChanges();

    const panelDe: DebugElement = fixture.debugElement;
    const titleDe = panelDe.query(By.css('.js-panel-title'));
    const div: HTMLElement = titleDe.nativeElement;
    expect(div.textContent).toEqual(givenTitle);
  });

  it('should obey given panel-state', () => {
    component.panelState = PanelState.MAXIMIZED;

    fixture.detectChanges();

    const panelDe: DebugElement = fixture.debugElement;
    const panelContainerDe = panelDe.query(By.css('.panel-body-maximized'));
    expect(panelContainerDe).toBeDefined();
  });


  it('should change panel-state', () => {

    component.panelState = PanelState.MAXIMIZED;
    fixture.detectChanges();

    component.panelStateChanged.subscribe(state => {
      expect(state).toBe(PanelState.COLLAPSED);
    })
    component.collapse();
    fixture.detectChanges();

    const panelDe: DebugElement = fixture.debugElement;
    const panelContainerDe = panelDe.query(By.css('.panel-normal'));
    expect(panelContainerDe).toBeDefined();
  });
  
});
