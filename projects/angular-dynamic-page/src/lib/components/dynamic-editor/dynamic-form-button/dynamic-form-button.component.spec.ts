import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormButtonComponent } from './dynamic-form-button.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSampleEndpointMetamodel } from '../../../test/dynamic-test-util';
import { EditorMode } from '../../../model/editor-mode.enum';
import { FormGroup } from '@angular/forms';

describe('DynamicFormButtonComponent', () => {
  let component: DynamicFormButtonComponent;
  let fixture: ComponentFixture<DynamicFormButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormButtonComponent ],
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
    fixture = TestBed.createComponent(DynamicFormButtonComponent);
    component = fixture.componentInstance;

    const cmd = createSampleEndpointMetamodel().findColumn('endpointInstanceId');
    component.field = {
        metadata: cmd,
        disabled: false,
        placeholder: '',
        type: 'text',
        validation: [],
        value: cmd.defaultValue
    };
    component.group = new FormGroup({});
    component.mode = EditorMode.CREATE;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
