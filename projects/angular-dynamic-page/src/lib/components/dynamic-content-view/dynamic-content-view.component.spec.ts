import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentViewComponent } from './dynamic-content-view.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';

describe('DynamicContentViewComponent', () => {
  let component: DynamicContentViewComponent;
  let fixture: ComponentFixture<DynamicContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicContentViewComponent ],
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
    fixture = TestBed.createComponent(DynamicContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
