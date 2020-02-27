import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSortHeaderComponent } from './table-sort-header.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../../test/dynamic-test-util';
import { TableFieldControl } from '../model/table-field-control';
import { TableField } from '../model/table-field';

describe('TableSortHeaderComponent', () => {
  let component: TableSortHeaderComponent;
  let fixture: ComponentFixture<TableSortHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports()
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ TableSortHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSortHeaderComponent);
    component = fixture.componentInstance;
    component.control = new TableFieldControl<any>('TestContent');
    component.field = TableField.of('testField', 'Test Field', false, 'static');
    component.control.addField(component.field);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
