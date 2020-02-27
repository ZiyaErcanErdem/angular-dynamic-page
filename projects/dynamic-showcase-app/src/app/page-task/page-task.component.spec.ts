import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTaskComponent } from './page-task.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from 'projects/angular-dynamic-page/src/lib/test/dynamic-test-util';

describe('PageTaskComponent', () => {
  let component: PageTaskComponent;
  let fixture: ComponentFixture<PageTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageTaskComponent ],
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
    fixture = TestBed.createComponent(PageTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
