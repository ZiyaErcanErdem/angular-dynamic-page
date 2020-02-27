import { TestBed } from '@angular/core/testing';

import { DynamicEventHubService } from './dynamic-event-hub.service';
import { prepareDynamicTestImports } from '../test/dynamic-test-util';
import { DynamicEvent } from '../model/dynamic-event';

describe('DynamicEventHubService', () => {
  let service: DynamicEventHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicEventHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe events with event-name', () => {

    service.subscribe('test.event', {
      next: (event) => {
        expect(event).toBeTruthy();
        expect(event.name).toEqual('test.event');
        expect(event.payload).toBeTruthy();
        expect(event.payload.body).toEqual('zee');
      }
    });

    service.publish(DynamicEvent.create('test.event', {body: 'zee'}));

  });
});
