import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'zee-dynamic-alert',
  templateUrl: './dynamic-alert.component.html',
  styleUrls: ['./dynamic-alert.component.scss']
})
export class DynamicAlertComponent implements OnInit {

  @Input() dismissible: boolean;
  @Input() type: string;
  @Output() alertClose = new EventEmitter<void>();

  get alertType(): {[key: string]: boolean} {
    return {
      alert : true,
      'alert-primary': this.type === 'primary' || this.type === 'alert',
      'alert-secondary': this.type === 'secondary',
      'alert-success': this.type === 'success',
      'alert-danger': this.type === 'danger' || this.type === 'error',
      'alert-warning': this.type === 'warning',
      'alert-info': this.type === 'info',
      'alert-light': this.type === 'light',
      'alert-dark': this.type === 'dark',
      'fade show alert-dismissible': this.dismissible
    };
  }
  constructor() { }

  ngOnInit(): void {
  }

  public closeHandler() { this.alertClose.emit(null); }

}
