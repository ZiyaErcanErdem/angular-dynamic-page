import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormInputComponent } from './dynamic-form-input.component';
import { prepareDynamicTestImports, prepareDynamicTestProviders, createSampleEndpointMetamodel } from '../../../test/dynamic-test-util';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';

describe('DynamicFormInputComponent', () => {
  let component: DynamicFormInputComponent;
  let fixture: ComponentFixture<DynamicFormInputComponent>;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports()
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicFormInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormInputComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
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
    component.group.addControl('endpointInstanceId', fb.control({}));
    component.mode = EditorMode.CREATE;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
