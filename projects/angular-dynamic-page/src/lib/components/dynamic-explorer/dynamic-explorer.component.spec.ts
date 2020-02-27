import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExplorerComponent } from './dynamic-explorer.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';

describe('DynamicExplorerComponent', () => {
  let component: DynamicExplorerComponent;
  let fixture: ComponentFixture<DynamicExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExplorerComponent ],
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
    fixture = TestBed.createComponent(DynamicExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
