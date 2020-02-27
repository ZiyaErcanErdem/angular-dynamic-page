import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueryComponent } from './dynamic-query.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';

describe('DynamicQueryComponent', () => {
  let component: DynamicQueryComponent;
  let fixture: ComponentFixture<DynamicQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQueryComponent ],
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
    fixture = TestBed.createComponent(DynamicQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
