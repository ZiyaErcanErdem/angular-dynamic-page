import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEditorComponent } from './dynamic-editor.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders } from '../../test/dynamic-test-util';
import { DynamicPageModule } from '../dynamic-page/dynamic-page.module';

describe('DynamicEditorComponent', () => {
  let component: DynamicEditorComponent;
  let fixture: ComponentFixture<DynamicEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports(),
        DynamicPageModule
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
