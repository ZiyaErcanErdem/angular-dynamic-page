import { TestBed } from '@angular/core/testing';

import { DynamicPopoverService } from './dynamic-popover.service';
import { prepareDynamicTestImports } from '../test/dynamic-test-util';
import { PopoverCloseEvent } from '../model/popover-close-event';

describe('DynamicPopoverService', () => {
  let service: DynamicPopoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicPopoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open alert dialog', () => {
    const popoverRef = service.openAlert<any>('TestAlert', {});
    expect(popoverRef).toBeTruthy();

    expect(popoverRef.content).toEqual('TestAlert');
    expect(popoverRef.type).toEqual('alert');

    popoverRef.afterClosed$.subscribe((event: PopoverCloseEvent) => {
      expect(event.type).toEqual('close');
      expect(event.data).toEqual('test');
    });

    popoverRef.close('test');
  });

  it('should open confirmation dialog', () => {
    const popoverRef = service.openConfirmation<any>('TestConfirmation', {});
    expect(popoverRef).toBeTruthy();

    expect(popoverRef.content).toEqual('TestConfirmation');
    expect(popoverRef.type).toEqual('confirmation');

    popoverRef.afterClosed$.subscribe((event: PopoverCloseEvent) => {
      expect(event.type).toEqual('close');
      expect(event.data).toEqual(true);
    });

    popoverRef.close(true);
  });
});
