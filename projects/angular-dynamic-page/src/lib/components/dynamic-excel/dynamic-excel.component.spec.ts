import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExcelComponent } from './dynamic-excel.component';
import { createSamplePageManager, prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';

describe('DynamicExcelComponent', () => {
  let component: DynamicExcelComponent;
  let fixture: ComponentFixture<DynamicExcelComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExcelComponent ],
      imports: [
        ...prepareDynamicTestImports(),
        DynamicPanelModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExcelComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);
    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
