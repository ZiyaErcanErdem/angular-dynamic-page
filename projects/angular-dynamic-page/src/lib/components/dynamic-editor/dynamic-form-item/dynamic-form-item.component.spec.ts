import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormItemComponent } from './dynamic-form-item.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../../test/dynamic-test-util';

describe('DynamicFormItemComponent', () => {
  let component: DynamicFormItemComponent;
  let fixture: ComponentFixture<DynamicFormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicFormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
