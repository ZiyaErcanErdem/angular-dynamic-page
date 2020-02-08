import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSortHeaderComponent } from './dynamic-sort-header.component';

describe('DynamicSortHeaderComponent', () => {
  let component: DynamicSortHeaderComponent;
  let fixture: ComponentFixture<DynamicSortHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicSortHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSortHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
