import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridActionsComponent } from './dynamic-grid-actions.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../../test/dynamic-test-util';

describe('DynamicGridActionsComponent', () => {
  let component: DynamicGridActionsComponent;
  let fixture: ComponentFixture<DynamicGridActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridActionsComponent ],
      imports: [
        ...prepareDynamicTestImports(),
      ],
      providers: [
        ...prepareDynamicTestProviders(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
