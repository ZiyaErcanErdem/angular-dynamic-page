import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExcelComponent } from './dynamic-excel.component';

describe('DynamicExcelComponent', () => {
  let component: DynamicExcelComponent;
  let fixture: ComponentFixture<DynamicExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
