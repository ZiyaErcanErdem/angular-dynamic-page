import { Injectable, Optional, SecurityContext } from '@angular/core';
import { DynamicAlert } from '../model/dynamic-alert';
import { AlertType } from '../model/alert-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DynamicAlertManagerService {
  private alertTimeoutInMilis = 5000;
  private alertSequence: number;
  private notifierSequence: number;
  private activeNotifierId: number;

  private alerts$: BehaviorSubject<Array<DynamicAlert>>;

  constructor(
    private sanitizer: DomSanitizer,
    @Optional() private translateService: TranslateService
  ) {
    this.alertSequence = 0; //
    this.notifierSequence = 0;
    this.activeNotifierId = 0;
    this.alerts$ = new BehaviorSubject<Array<DynamicAlert>>([]);
  }

  public alerts(): Observable<Array<DynamicAlert>> {
    return this.alerts$.asObservable();
  }

  public clear(): void {
    return this.alerts$.next([]);
  }

  public alert({msg, params, i18n}: { msg: string, params?: any, i18n?: boolean }): DynamicAlert {
    return this.addAlert({ type: AlertType.alert, msg, params, timeout: this.alertTimeoutInMilis, i18n });
  }

  public error({msg, params, i18n}: { msg: string, params?: any, i18n?: boolean }): DynamicAlert {
    return this.addAlert({ type: AlertType.error, msg, params, timeout: this.alertTimeoutInMilis, i18n });
  }

  public info({msg, params, i18n}: { msg: string, params?: any, i18n?: boolean }): DynamicAlert {
    return this.addAlert({ type: AlertType.info, msg, params, timeout: this.alertTimeoutInMilis, i18n });
  }

  public warning({msg, params, i18n}: { msg: string, params?: any, i18n?: boolean }): DynamicAlert {
    return this.addAlert({ type: AlertType.warning, msg, params, timeout: this.alertTimeoutInMilis, i18n });
  }

  public closeAlert(alertId: number): void {
    const currentAlerts = this.getCurrent();
    if (currentAlerts) {
      const alertIndex = currentAlerts.map(e => e.id).indexOf(alertId);
      currentAlerts.splice(alertIndex, 1);
      this.alerts$.next(currentAlerts);
    }
  }

  private getCurrent(): Array<DynamicAlert> {
    return this.alerts$.value || [];
  }

  public getNotifierId(): number {
    return this.notifierSequence++;
  }

  public activateNotifier(notifierId: number): void {
    if (this.activeNotifierId <= 0) {
      this.activeNotifierId = notifierId;
    }
  }

  public passivateNotifier(notifierId: number): void {
    this.activeNotifierId = 0;
  }

  public isActiveNotifier(notifierId: number): boolean {
    return this.activeNotifierId === notifierId;
  }

  private addAlert(options: DynamicAlert): DynamicAlert {
    options.id = this.alertSequence++;
    if (options.i18n && options.msg) {
      options.msg = this.translateService.instant(options.msg, options.params);
    }
    const alert = this.create(options);
    if (alert.timeout && alert.timeout > 0) {
        setTimeout(() => {
            this.closeAlert(alert.id);
        }, alert.timeout);
    }
    return alert;
  }

  private create({id, type, msg, timeout, i18n = false}: DynamicAlert): DynamicAlert {
    const alert: DynamicAlert = {
      id,
      type,
      msg: this.sanitizer.sanitize(SecurityContext.HTML, msg),
      timeout,
      i18n,
      close: () => this.closeAlert(id)
    };
    const currentAlerts = this.getCurrent();
    currentAlerts.push(alert);
    this.alerts$.next(currentAlerts);
    return alert;
  }
}
