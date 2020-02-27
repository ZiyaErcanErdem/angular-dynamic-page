import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPageActionsComponent } from './dynamic-page-actions.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { DynamicQueryModule } from '../dynamic-query/dynamic-query.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';

describe('DynamicPageActionsComponent', () => {
  let component: DynamicPageActionsComponent;
  let fixture: ComponentFixture<DynamicPageActionsComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicPanelModule,
        DynamicQueryModule,
        DynamicButtonModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicPageActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPageActionsComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
