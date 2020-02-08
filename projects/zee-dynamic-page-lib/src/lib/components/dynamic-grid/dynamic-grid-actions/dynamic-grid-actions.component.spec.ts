import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridActionsComponent } from './dynamic-grid-actions.component';

describe('DynamicGridActionsComponent', () => {
  let component: DynamicGridActionsComponent;
  let fixture: ComponentFixture<DynamicGridActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
