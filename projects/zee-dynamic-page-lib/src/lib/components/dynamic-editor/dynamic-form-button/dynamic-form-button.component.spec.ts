import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormButtonComponent } from './dynamic-form-button.component';

describe('DynamicFormButtonComponent', () => {
  let component: DynamicFormButtonComponent;
  let fixture: ComponentFixture<DynamicFormButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
