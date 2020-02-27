import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridComponent } from './dynamic-grid.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSamplePageManager } from '../../test/dynamic-test-util';
import { DynamicService } from '../../services/dynamic.service';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DynamicPaginationModule } from '../dynamic-pagination/dynamic-pagination.module';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';

describe('DynamicGridComponent', () => {
  let component: DynamicGridComponent;
  let fixture: ComponentFixture<DynamicGridComponent>;
  let dynamicService: DynamicService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        CdkTableModule,
        FlexLayoutModule,
        DynamicPaginationModule,
        DynamicButtonModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGridComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
