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

  i18nEnabled: boolean;

  constructor() {
      this.i18nEnabled = true;
  }

  i18nValues(): object {
      const first = (this.page - 1) * this.itemsPerPage === 0 ? 1 : (this.page - 1) * this.itemsPerPage + 1;
      const second = this.page * this.itemsPerPage < this.total ? this.page * this.itemsPerPage : this.total;

      return {
          first,
          second,
          total: this.total
      };
  }
}
