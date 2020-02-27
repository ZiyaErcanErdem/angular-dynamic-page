import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPortalComponent } from './dynamic-portal.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';
import { DynamicPanelModule } from '../dynamic-panel/dynamic-panel.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';

describe('DynamicPortalComponent', () => {
  let component: DynamicPortalComponent;
  let fixture: ComponentFixture<DynamicPortalComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicPanelModule,
        DynamicButtonModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPortalComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
