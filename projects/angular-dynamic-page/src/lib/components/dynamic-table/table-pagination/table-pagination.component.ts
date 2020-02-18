import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { TableFieldControl } from '../model/table-field-control';

@Component({
  selector: 'zee-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  control: TableFieldControl<any>;

  private pageNumber: number;

  constructor() {
      super();
      this.pageNumber = 1;
  }

  get activated(): boolean {
      return !!(this.control && this.control.paginator);
  }

  get pageIndex(): number {
      return this.activated ? this.control.paginator.pageIndex + 1 : this.pageNumber;
  }

  set pageIndex(value: number) {
      this.pageNumber = value;
      if (this.activated) {
          this.control.paginator.pageIndex = this.pageNumber - 1;
      }
  }

  get dataSize(): number {
      return this.activated ? this.control.paginator.dataSize : 0;
  }

  get pageSize(): number {
      return this.activated ? this.control.paginator.pageSize : 20;
  }

  ngOnInit() {}
}
