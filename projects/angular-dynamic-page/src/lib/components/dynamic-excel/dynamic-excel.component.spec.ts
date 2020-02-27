import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExcelComponent } from './dynamic-excel.component';
import { CommonModule } from '@angular/common';
import { DynamicCoreModule } from '../../dynamic-core/dynamic-core.module';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { createSamplePageManager, prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DynamicConfigService } from '../../services/dynamic-config.service';

describe('DynamicExcelComponent', () => {
  let component: DynamicExcelComponent;
  let fixture: ComponentFixture<DynamicExcelComponent>;
  let dynamicConfigService: DynamicConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExcelComponent ],
      imports: [
        ...prepareDynamicTestImports()
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
    dynamicConfigService = TestBed.inject(DynamicConfigService)
    component.manager = createSamplePageManager(dynamicConfigService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
