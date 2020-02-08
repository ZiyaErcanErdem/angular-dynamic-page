import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicAction } from '../../model/dynamic-action';

@Component({
  selector: 'zee-dynamic-button',
  templateUrl: './dynamic-button.component.html',
  styleUrls: ['./dynamic-button.component.scss']
})
export class DynamicButtonComponent implements OnInit, OnDestroy {
  @Input()
  action: DynamicAction<any>;

  constructor() {}

  get isDropDown(): boolean {
      return !!this.action && this.action.hasChilds();
  }

  get isVisible(): boolean {
      return !!this.action && this.action.visible;
  }

  get hasLabel(): boolean {
      return this.isVisible && !!this.action.label;
  }

  get hasBadge(): boolean {
      return this.isVisible && !!this.action.badge;
  }

  get iconPadding(): string {
      return this.hasLabel ? 'pr-1' : '';
  }

  ngOnInit() {}

  ngOnDestroy() {
      this.action = undefined;
  }
}

