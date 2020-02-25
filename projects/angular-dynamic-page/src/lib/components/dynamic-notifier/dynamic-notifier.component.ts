import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DynamicAlertManagerService } from '../../services/dynamic-alert-manager.service';
import { DynamicAlert } from '../../model/dynamic-alert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zee-dynamic-notifier',
  templateUrl: './dynamic-notifier.component.html',
  styleUrls: ['./dynamic-notifier.component.scss']
})
export class DynamicNotifierComponent implements OnInit, OnDestroy {
  @Input() position: string;
  public alerts: DynamicAlert[];
  private subscription: Subscription;
  private notifierId: number;

  constructor(private alertService: DynamicAlertManagerService) {
    this.alerts = [];
  }

  get positionClass(): string {
    return this.position ? this.position : 'top right';
  }

  ngOnInit(): void {
    this.notifierId = this.alertService.getNotifierId();
    this.subscription = this.alertService.alerts().subscribe(alerts => {
      this.alertService.activateNotifier(this.notifierId);
      if (this.alertService.isActiveNotifier(this.notifierId)) {
        this.alerts = (alerts || []).filter(a => a && a.type && a.msg);
      } else {
        this.alerts = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.alertService.passivateNotifier(this.notifierId);
  }

}
