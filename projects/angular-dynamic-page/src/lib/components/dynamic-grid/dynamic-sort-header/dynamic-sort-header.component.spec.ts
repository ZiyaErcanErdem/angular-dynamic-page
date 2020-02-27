import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSortHeaderComponent } from './dynamic-sort-header.component';
import {
  prepareDynamicTestImports,
  prepareDynamicTestProviders,
  createSamplePageManager,
  createSampleEndpointMetamodel
} from '../../../test/dynamic-test-util';
import { DynamicService } from '../../../services/dynamic.service';
import { Criteria } from '../../../model/criteria';
import { Condition } from '../../../model/condition.enum';

describe('DynamicSortHeaderComponent', () => {
  let component: DynamicSortHeaderComponent;
  let fixture: ComponentFixture<DynamicSortHeaderComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports()
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicSortHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSortHeaderComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    component.column = createSampleEndpointMetamodel().findColumn('endpointInstanceId');
    component.criteria = new Criteria(Condition.AND);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
