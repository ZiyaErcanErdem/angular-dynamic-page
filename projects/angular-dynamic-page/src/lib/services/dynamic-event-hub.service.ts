import { Injectable } from '@angular/core';
import { DynamicEvent } from '../model/dynamic-event';
import { Subject, Observable, Subscription, PartialObserver } from 'rxjs';
import { share, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DynamicEventHubService {

  private events$: Subject<DynamicEvent<any>>;
  private observable$: Observable<DynamicEvent<any> | string>;

  constructor() {
    this.events$ = new Subject();
    this.observable$ = this.events$.asObservable().pipe(share());
  }

  publish(event: DynamicEvent<unknown>): void {
    this.events$.next(event);
  }

  subscribe(eventName: string, observer?: PartialObserver<any>): Subscription {
    const subscriber: Subscription = this.observable$
        .pipe(
            filter((event: DynamicEvent<any>) =>  event.name === eventName),
        )
        .subscribe(observer);
    return subscriber;
  }

  unsubscribe(subscriber: Subscription): void {
    if (subscriber) {
      subscriber.unsubscribe();
    }
  }
  
}
