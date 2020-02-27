import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridConfigurerComponent } from './dynamic-grid-configurer.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../../test/dynamic-test-util';

describe('DynamicGridConfigurerComponent', () => {
  let component: DynamicGridConfigurerComponent;
  let fixture: ComponentFixture<DynamicGridConfigurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridConfigurerComponent ],
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
    fixture = TestBed.createComponent(DynamicGridConfigurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
