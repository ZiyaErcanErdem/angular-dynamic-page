import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentViewComponent } from './dynamic-content-view.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DynamicGridModule } from '../dynamic-grid/dynamic-grid.module';

describe('DynamicContentViewComponent', () => {
  let component: DynamicContentViewComponent;
  let fixture: ComponentFixture<DynamicContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicContentViewComponent ],
      imports: [
        ...prepareDynamicTestImports(),
        DynamicGridModule
      ],
      providers: [
        ...prepareDynamicTestProviders(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
