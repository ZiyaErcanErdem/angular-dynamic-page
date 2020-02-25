import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';

export interface Page {
  type: 'first' | 'prev' | 'page' | 'ellipsis' | 'next' | 'last';
  disabled?: boolean;
  num: number;
  label?: string;
  ariaLabel?: string;
  tabIndex?: string;
  current?: boolean;
}

@Component({
  selector: 'zee-dynamic-pager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-pager.component.html',
  styleUrls: ['./dynamic-pager.component.scss']
})
export class DynamicPagerComponent implements OnChanges {
  pageCount = 0;
  pages: Page[] = [];
  page: Page = { num: 1, type: 'page' };

  @Input() disabled: boolean;
  @Input() boundaries = true;
  @Input() directions = true;
  @Input() ellipses = true;
  @Input() rotate = true;
  @Input() dataSize: number;
  @Input() maxSize: number;
  @Input() set pageNumber(value: number) {
    this.page = {num: value, type: 'page'};
  }
  get pageNumber(): number {
    return this.page?.num;
  }
  @Input() pageSize: number;
  @Input() size: 'sm' | 'lg';
  @Output() pageNumberChange = new EventEmitter<number>(true);

  get paginationClass(): string {
    return (this.size ? `pagination pagination-${this.size}` : 'pagination');
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePages(this.page);
  }

  private hasPrevious(): boolean { return this.page.num > 1; }

  private hasNext(): boolean { return this.page.num < this.pageCount; }

  private nextDisabled(): boolean { return !this.hasNext() || this.disabled; }

  private previousDisabled(): boolean { return !this.hasPrevious() || this.disabled; }

  public selectPage(page: Page): void { this.updatePages(page); }

  private toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  private isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  private getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }

  private setupPages(): void {
    if (this.directions) {
      this.pages.unshift({ type: 'prev', num: this.page.num - 1 });
      this.pages.push({ type: 'next', num: this.page.num + 1 });
    }
    if (this.boundaries) {
      this.pages.unshift({ type: 'first', num: 1 });
      this.pages.push({ type: 'last', num: this.pageCount });
    }
    this.pages.forEach(p => {
      if (p.type === 'first' || p.type === 'prev') {
        p.disabled = this.previousDisabled();
        p.tabIndex = p.disabled ? '-1' : null;
        p.current = false;
        p.label = p.type === 'first' ? '&laquo;&laquo;' : '&laquo;';
        p.ariaLabel = p.type === 'first' ? 'First' : 'Previous';
      } else if (p.type === 'ellipsis') {
        p.disabled = true;
        p.tabIndex = '-1';
        p.current = false;
        p.label = '...';
        p.ariaLabel = p.label;
      } else if (p.type === 'page') {
        p.disabled = this.disabled;
        p.tabIndex = p.disabled ? '-1' : null;
        p.current = p.num === this.page.num;
        p.label = `${p.num}`;
        p.ariaLabel = p.label;
      } else if (p.type === 'next' || p.type === 'last') {
        p.disabled = this.nextDisabled();
        p.tabIndex = p.disabled ? '-1' : null;
        p.current = false;
        p.label = p.type === 'next' ? '&raquo;' : '&raquo;&raquo;';
        p.ariaLabel = p.type === 'next' ? 'Next' : 'Last';
      }

    });
  }

  private updatePages(newPage: Page): void {
    if (newPage.type === 'ellipsis') {
      return;
    }
    this.pageCount = Math.ceil(this.dataSize / this.pageSize);

    if (!this.isNumber(this.pageCount)) {
      this.pageCount = 0;
    }

    this.pages = [];
    for (let i = 1; i <= this.pageCount; i++) {
      this.pages.push({ type: 'page', num: i });
    }
    this.setupPageInRange(newPage);

    if (this.maxSize > 0 && this.pageCount > this.maxSize) {
      let start = 0;
      let end = this.pageCount;

      if (this.rotate) {
        [start, end] = this.setupRotation();
      } else {
        [start, end] = this.setupPagination();
      }

      this.pages = this.pages.slice(start, end);

      this.setupEllipses(start, end);
    }

    this.setupPages();
  }

  private setupEllipses(start: number, end: number): void {
      if (!this.ellipses) {
        return;
      }
      if (start > 0) {
        if (start > 2) {
          this.pages.unshift({ type: 'ellipsis', num: -1 });
        } else if (start === 2) {
          this.pages.unshift({ type: 'ellipsis', num: 2 });
        }
        this.pages.unshift({ type: 'ellipsis', num: 1 });
      }
      if (end < this.pageCount) {
        if (end < (this.pageCount - 2)) {
          this.pages.push({ type: 'ellipsis', num: -1 });
        } else if (end === (this.pageCount - 2)) {
          this.pages.push({ type: 'ellipsis', num: this.pageCount - 1} );
        }
        this.pages.push({ type: 'ellipsis', num: this.pageCount });
      }
  }

  private setupRotation(): [number, number] {
    let start = 0;
    let end = this.pageCount;
    const leftOffset = Math.floor(this.maxSize / 2);
    const rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.page?.num <= leftOffset) {
      end = this.maxSize;
    } else if (this.pageCount - this.page?.num < leftOffset) {
      start = this.pageCount - this.maxSize;
    } else {
      start = this.page?.num - leftOffset - 1;
      end = this.page?.num + rightOffset;
    }

    return [start, end];
  }

  private setupPagination(): [number, number] {
    const page = Math.ceil(this.page?.num / this.maxSize) - 1;
    const start = page * this.maxSize;
    const end = start + this.maxSize;

    return [start, end];
  }

  private setupPageInRange(newPageNo: Page): void {
    const prevPageNo = this.page;
    this.page = { type: 'page', num: this.getValueInRange(newPageNo.num, this.pageCount, 1) };

    if (this.page?.num !== prevPageNo?.num && this.isNumber(this.dataSize)) {
      this.pageNumberChange.emit(this.page?.num);
    }
  }
}
