import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { TableField } from '../model/table-field';

@Component({
  selector: 'zee-table-cell-view',
  templateUrl: './table-cell-view.component.html',
  styleUrls: ['./table-cell-view.component.scss']
})
export class TableCellViewComponent implements OnInit, OnDestroy {
  @Input()
  field: TableField<any>;
  @Input()
  row: any;
  @Output()
  rowChange: EventEmitter<{ field: TableField<any>; row: any }> = new EventEmitter<{ field: TableField<any>; row: any }>();

  get value() {
      return this.field.read(this.row);
  }

  set value(val: any) {
      this.field.write(this.row, val);
  }

  constructor() {}

  public handleRowChange(field: TableField<any>, row: any, event: MouseEvent): void {
      if (event) {
          event.preventDefault();
      }
      this.rowChange.emit({ field, row });
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
