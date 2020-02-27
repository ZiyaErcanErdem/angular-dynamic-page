import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicItemCountComponent } from './dynamic-item-count.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DynamicItemCountComponent', () => {
  let component: DynamicItemCountComponent;
  let fixture: ComponentFixture<DynamicItemCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
      ],
      providers: [
        ...prepareDynamicTestProviders(),
      ],
      declarations: [ DynamicItemCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicItemCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render item-count of given parameters', () => {
    const itemCountDe: DebugElement = fixture.debugElement;
    component.i18n = false;
    component.page = 3;
    component.itemsPerPage = 20;
    component.total = 100;

    fixture.detectChanges();
    expect(itemCountDe.nativeElement.textContent).toContain(`Showing ${component.first} - ${component.second} of ${component.total} items`);
  });
});
