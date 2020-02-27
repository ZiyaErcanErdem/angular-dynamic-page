import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPopoverComponent } from './dynamic-popover.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { PopoverRef } from '../../model/popover-ref';
import { PopoverType } from '../../model/popover-type';
import { Theme } from '../../model/theme.enum';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';

describe('DynamicPopoverComponent', () => {
  let component: DynamicPopoverComponent;
  let fixture: ComponentFixture<DynamicPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicButtonModule
      ],
      providers: [
        ...prepareDynamicTestProviders(),
        { provide: PopoverRef, useValue: new PopoverRef<any, any>('alert', {theme: Theme.dark}, null, 'TestContent', {}) }
      ],
      declarations: [ DynamicPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
