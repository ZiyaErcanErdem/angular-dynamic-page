import { Component, Input } from '@angular/core';

@Component({
  selector: 'zee-dynamic-item-count',
  templateUrl: './dynamic-item-count.component.html',
  styleUrls: ['./dynamic-item-count.component.scss']
})
export class DynamicItemCountComponent {

  @Input() page: number;

  @Input() total: number;

  @Input() itemsPerPage: number;

  @Input() i18n: boolean;

  get first(): number {
    return (this.page - 1) * this.itemsPerPage === 0 ? 1 : (this.page - 1) * this.itemsPerPage + 1;
  }

  get second(): number {
    return this.page * this.itemsPerPage < this.total ? this.page * this.itemsPerPage : this.total;
  }

  constructor() {
      this.i18n = true;
  }

  i18nValues(): object {
      const first = (this.page - 1) * this.itemsPerPage === 0 ? 1 : (this.page - 1) * this.itemsPerPage + 1;
      const second = this.page * this.itemsPerPage < this.total ? this.page * this.itemsPerPage : this.total;

      return {
          first: this.first,
          second: this.second,
          total: this.total
      };
  }
}
