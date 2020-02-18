import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../../model/dynamic-base-component';
import { ColumnMetadata } from '../../../model/column-metadata';
import { Criteria } from '../../../model/criteria';
import { PageManager } from '../../../model/page-manager';
import { PageConfig } from '../../../model/page-config';
import { RelationType } from '../../../model/relation-type.enum';
import { ColumnType } from '../../../model/column-type.enum';
import { SortContext } from '../../../model/sort-context';

@Component({
  selector: 'zee-dynamic-sort-header',
  templateUrl: './dynamic-sort-header.component.html',
  styleUrls: ['./dynamic-sort-header.component.scss']
})
export class DynamicSortHeaderComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  column: ColumnMetadata;
  @Input()
  manager: PageManager<any>;
  @Input()
  criteria: Criteria;

  direction: string;

  private pageConfig: PageConfig<any>;

  get prefix() {
      if (this.column.name === 'id' && this.column.relType !== RelationType.SELF) {
          return this.pageConfig.toI18nEntity(this.pageConfig.capitalizeFirstLetter(this.column.group));
      }
      return '';
  }

  get showPrefix() {
      return this.column.name === 'id' && this.column.relType !== RelationType.SELF;
  }

  get sortIcon() {
      if (!this.direction && this.column && this.pageConfig) {
          if (this.column.name === this.pageConfig.predicate) {
              this.direction = this.pageConfig.reverse ? 'desc' : 'asc';
          }
      }

      if (!this.direction || !this.column) {
          return 'sort';
      } else if (this.direction === 'asc') {
          if (this.column.columnType === ColumnType.NUMBER || this.column.columnType === ColumnType.DOUBLE) {
              return 'sort-numeric-down';
          }
          return 'sort-alpha-down';
      } else if (this.direction === 'desc') {
          if (this.column.columnType === ColumnType.NUMBER || this.column.columnType === ColumnType.DOUBLE) {
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
      this.pageConfig = this.manager.config;
      this.collect = this.manager.sortChanged().subscribe(ctx => {
          if (ctx.column !== this.column) {
              this.direction = '';
          } else {
              this.direction = ctx.direction;
          }
      });
  }

  ngOnDestroy() {
      this.clean();
  }

  handleSortRequest() {
      const dir = this.direction === 'desc' ? 'asc' : 'desc';
      const ctx: SortContext = { direction: dir, column: this.column };
      this.manager.sortWith(ctx, this.criteria).subscribe();
  }
}

