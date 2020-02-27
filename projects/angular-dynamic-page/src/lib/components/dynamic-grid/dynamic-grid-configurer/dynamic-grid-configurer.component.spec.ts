import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridConfigurerComponent } from './dynamic-grid-configurer.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../../test/dynamic-test-util';
import { DynamicService } from '../../../services/dynamic.service';

describe('DynamicGridConfigurerComponent', () => {
  let component: DynamicGridConfigurerComponent;
  let fixture: ComponentFixture<DynamicGridConfigurerComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridConfigurerComponent ],
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
    fixture = TestBed.createComponent(DynamicGridConfigurerComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
