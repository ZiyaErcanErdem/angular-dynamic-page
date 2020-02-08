import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPageActionsComponent } from './dynamic-page-actions.component';

describe('DynamicPageActionsComponent', () => {
  let component: DynamicPageActionsComponent;
  let fixture: ComponentFixture<DynamicPageActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPageActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPageActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
