import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExplorerComponent } from './dynamic-explorer.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DynamicButtonModule } from '../dynamic-button/dynamic-button.module';

describe('DynamicExplorerComponent', () => {
  let component: DynamicExplorerComponent;
  let fixture: ComponentFixture<DynamicExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExplorerComponent ],
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
    fixture = TestBed.createComponent(DynamicExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
