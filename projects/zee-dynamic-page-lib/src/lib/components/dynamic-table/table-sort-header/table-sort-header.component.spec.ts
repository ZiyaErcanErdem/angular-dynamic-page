import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSortHeaderComponent } from './table-sort-header.component';

describe('TableSortHeaderComponent', () => {
  let component: TableSortHeaderComponent;
  let fixture: ComponentFixture<TableSortHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSortHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSortHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
