import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridActionsComponent } from './dynamic-grid-actions.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../../test/dynamic-test-util';
import { DynamicService } from '../../../services/dynamic.service';
import { DynamicButtonModule } from '../../dynamic-button/dynamic-button.module';

describe('DynamicGridActionsComponent', () => {
  let component: DynamicGridActionsComponent;
  let fixture: ComponentFixture<DynamicGridActionsComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridActionsComponent ],
      imports: [
        ...prepareDynamicTestImports(),
        DynamicButtonModule
      ],
      providers: [
        ...prepareDynamicTestProviders(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGridActionsComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
