import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellViewComponent } from './table-cell-view.component';

describe('TableCellViewComponent', () => {
  let component: TableCellViewComponent;
  let fixture: ComponentFixture<TableCellViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCellViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
