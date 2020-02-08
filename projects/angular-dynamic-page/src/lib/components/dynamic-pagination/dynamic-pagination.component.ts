import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { PageBuilder } from '../../model/page-builder';
import { Criteria } from '../../model/criteria';
import { PageConfig } from '../../model/page-config';

@Component({
  selector: 'zee-dynamic-pagination',
  templateUrl: './dynamic-pagination.component.html',
  styleUrls: ['./dynamic-pagination.component.scss']
})
export class DynamicPaginationComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  builder: PageBuilder<any>;
  @Input()
  criteria: Criteria;
  config: PageConfig<any>;
  ready = false;

  private _pageNum: number;

  constructor() {
      super();
      this._pageNum = 1;
  }

  get pageNumber(): number {
      return this.config ? this.config.page : this._pageNum;
  }

  set pageNumber(value: number) {
      this._pageNum = value;
      if (this.config) {
          this.config.page = this._pageNum;
      }
  }

  get pageSize(): number {
      return this.config ? this.config.itemsPerPage : 20;
  }

  get collectionSize(): number {
      return this.config ? this.config.totalItems : 0;
  }

  get total(): number {
      return this.config ? this.config.queryCount : 0;
  }

  get itemsPerPage(): number {
      return this.config ? this.config.itemsPerPage : 20;
  }

  public navigateToPage(): void {
      this.builder.navigate(this.criteria, this.config.page).subscribe();
  }

  ngOnInit() {
      this.builder.ready().subscribe(isReady => {
          if (isReady) {
              this.config = this.builder.config;
              this.ready = isReady;
          }
      });
  }
}
