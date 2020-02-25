import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DynamicEventHubService } from '../services/dynamic-event-hub.service';
import { tap, catchError } from 'rxjs/operators';
import { DynamicEvent } from '../model/dynamic-event';
import { DynamicAlertManagerService } from '../services/dynamic-alert-manager.service';

@Injectable()
export class DynamicHttpListenerInterceptor implements HttpInterceptor {

  constructor(
    private eventHub: DynamicEventHubService,
    private alertManager: DynamicAlertManagerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.monitorError(err);
        }
        return of(err);
      }),
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          this.monitorResponse(event);
        }
      })
    );
  }

  private monitorError(err: HttpErrorResponse): void {
    if (err.status !== 401) {
      this.eventHub.publish(DynamicEvent.create('dynamic.httpError', err));
      this.publishAsError(err);
    }
  }

  private monitorResponse(response: HttpResponse<unknown>): void {
    let msg: string | null = null;
    let param: string | null = null;

    response.headers.keys().forEach(entry => {
      const header = entry.toLowerCase();
      if (header.endsWith('app-alert')) {
        msg = response.headers.get(entry);
      } else if (header.endsWith('app-params')) {
        param = decodeURIComponent(response.headers.get(entry).replace(/\+/g, ' '));
      }
    });

    if (msg) {
      this.alertManager.alert({msg,  params: { param }, i18n: true });
    }
  }

  private publishAsError(response: HttpErrorResponse): void {
      switch (response.status) {
        case 0:
          this.alertManager.error({msg: 'dynamic.error.server-not-reachable', i18n: true });
          break;

        case 400: {
          const arr = response.headers.keys();
          let msg = null;
          let params = null;
          arr.forEach(entry => {
            const header = entry.toLowerCase();
            if (header.endsWith('app-error')) {
              msg = response.headers.get(entry);
            } else if (header.endsWith('app-params')) {
              params = response.headers.get(entry);
            }
          });
          if (msg) {
            this.alertManager.error({msg, params: { params }, i18n: true });
          } else if (response.error?.fieldErrors) {
            const fieldErrors = response.error.fieldErrors;
            for (const fieldError of fieldErrors) {
              if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                fieldError.message = 'Size';
              }
              const fieldName = fieldError.field.replace(/\[\d*\]/g, '[]');
              this.alertManager.error({msg: 'dynamic.error.' + + fieldError.message, params: { fieldName }, i18n: true });
            }
          } else if (response.error?.message) {
            this.alertManager.error({msg: response.error.message, params: response.error.params, i18n: false });
          } else {
            this.alertManager.error({msg: response.error, i18n: false });
          }
          break;
        }

        case 404:
          this.alertManager.error({msg: 'dynamic.error.url-not-found', i18n: true });
          break;

        default:
          if (response.error?.message) {
            this.alertManager.error({msg: response.error.message, i18n: false });
          } else {
            this.alertManager.error({msg: response.error, i18n: false });
          }
      }
  }
}
