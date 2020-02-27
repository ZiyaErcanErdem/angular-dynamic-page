import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPaginationComponent } from './dynamic-pagination.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';
import { DynamicPagerModule } from '../dynamic-pager/dynamic-pager.module';
import { DynamicItemCountModule } from '../dynamic-item-count/dynamic-item-count.module';

describe('DynamicPaginationComponent', () => {
  let component: DynamicPaginationComponent;
  let fixture: ComponentFixture<DynamicPaginationComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicPagerModule,
        DynamicItemCountModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPaginationComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
