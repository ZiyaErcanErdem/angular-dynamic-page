import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueryComponent } from './dynamic-query.component';

describe('DynamicQueryComponent', () => {
  let component: DynamicQueryComponent;
  let fixture: ComponentFixture<DynamicQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
