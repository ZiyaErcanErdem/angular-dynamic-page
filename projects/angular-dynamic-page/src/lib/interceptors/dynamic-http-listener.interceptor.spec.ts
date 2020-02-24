import { TestBed } from '@angular/core/testing';

import { DynamicHttpListenerInterceptor } from './dynamic-http-listener.interceptor';

describe('DynamicHttpListenerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DynamicHttpListenerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DynamicHttpListenerInterceptor = TestBed.inject(DynamicHttpListenerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
