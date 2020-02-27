import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePaginationComponent } from './table-pagination.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../../test/dynamic-test-util';
import { TableFieldControl } from '../model/table-field-control';
import { DynamicItemCountModule } from '../../dynamic-item-count/dynamic-item-count.module';

describe('TablePaginationComponent', () => {
  let component: TablePaginationComponent;
  let fixture: ComponentFixture<TablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicItemCountModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ TablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePaginationComponent);
    component = fixture.componentInstance;
    component.control = new TableFieldControl<any>('TestContent');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
