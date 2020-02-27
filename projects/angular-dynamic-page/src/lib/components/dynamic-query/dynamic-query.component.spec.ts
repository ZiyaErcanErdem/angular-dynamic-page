import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQueryComponent } from './dynamic-query.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';

describe('DynamicQueryComponent', () => {
  let component: DynamicQueryComponent;
  let fixture: ComponentFixture<DynamicQueryComponent>;
  let dynamicService: DynamicService;

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
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
