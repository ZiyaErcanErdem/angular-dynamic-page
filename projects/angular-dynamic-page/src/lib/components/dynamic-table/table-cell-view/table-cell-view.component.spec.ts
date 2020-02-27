import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellViewComponent } from './table-cell-view.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../../test/dynamic-test-util';
import { TableField } from '../model/table-field';
import { TableCellViewPipe } from '../pipes/table-cell-view.pipe';

describe('TableCellViewComponent', () => {
  let component: TableCellViewComponent;
  let fixture: ComponentFixture<TableCellViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports()
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ TableCellViewComponent, TableCellViewPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellViewComponent);
    component = fixture.componentInstance;
    component.field = TableField.of('testField', 'Test Field', false, 'static');
    component.row = {testField: 'testData'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
