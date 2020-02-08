import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { TableField } from '../../../model/table-field';
import { TableFieldControl, TableSortContext } from '../../../model/table-field-control';

@Component({
  selector: 'zee-table-sort-header',
  templateUrl: './table-sort-header.component.html',
  styleUrls: ['./table-sort-header.component.scss']
})
export class TableSortHeaderComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  field: TableField<any>;
  @Input()
  control: TableFieldControl<any>;

  direction: string;

  get sortable(): boolean {
    return !(this.field.type === 'action');
  }

  get sortIcon() {
    if (!this.direction && this.field) {
      if (this.field.name === this.control.predicate) {
        this.direction = this.control.reverse ? 'desc' : 'asc';
      }
    }

    if (!this.direction || !this.field) {
      return 'sort';
    } else if (this.direction === 'asc') {
      if (this.field.type === 'number') {
        return 'sort-numeric-down';
      }
      return 'sort-alpha-down';
    } else if (this.direction === 'desc') {
      if (this.field.type === 'number') {
        return 'sort-numeric-up';
      }
      return 'sort-alpha-up';
    }
    return 'sort';
  }

  constructor() {
    super();
  }

  ngOnInit() {
    this.collect = this.control.sortChanged().subscribe(ctx => {
      if (ctx.field !== this.field) {
        this.direction = '';
      } else {
        this.direction = ctx.direction;
      }
    });
  }

  public handleSortRequest() {
    if (this.field.type === 'action') {
      return;
    }
    const dir = this.direction === 'desc' ? 'asc' : 'desc';
    const ctx: TableSortContext = { direction: dir, field: this.field };
    this.control.sortWith(ctx);
  }
}
