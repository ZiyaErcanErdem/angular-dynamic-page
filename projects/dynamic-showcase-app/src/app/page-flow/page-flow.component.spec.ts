import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFlowComponent } from './page-flow.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from 'projects/angular-dynamic-page/src/lib/test/dynamic-test-util';

describe('PageFlowComponent', () => {
  let component: PageFlowComponent;
  let fixture: ComponentFixture<PageFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFlowComponent ],
      imports: [
        ...prepareDynamicTestImports(),
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
