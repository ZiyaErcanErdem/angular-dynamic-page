import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormAssociationComponent } from './dynamic-form-association.component';

describe('DynamicFormAssociationComponent', () => {
  let component: DynamicFormAssociationComponent;
  let fixture: ComponentFixture<DynamicFormAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
