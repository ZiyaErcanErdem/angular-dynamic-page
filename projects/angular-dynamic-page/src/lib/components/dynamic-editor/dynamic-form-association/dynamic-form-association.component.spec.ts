import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormAssociationComponent } from './dynamic-form-association.component';
import {
  prepareDynamicTestImports,
  prepareDynamicTestProviders,
  createSampleEndpointMetamodel,
  createSamplePageManager
} from '../../../test/dynamic-test-util';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorMode } from '../../../model/editor-mode.enum';
import { DynamicService } from '../../../services/dynamic.service';

describe('DynamicFormAssociationComponent', () => {
  let component: DynamicFormAssociationComponent;
  let fixture: ComponentFixture<DynamicFormAssociationComponent>;
  let dynamicService: DynamicService;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...prepareDynamicTestImports()
      ],
      providers: [
        ...prepareDynamicTestProviders()
      ],
      declarations: [ DynamicFormAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormAssociationComponent);
    component = fixture.componentInstance;
    dynamicService = TestBed.inject(DynamicService);

    component.manager = createSamplePageManager(dynamicService);

    fb = TestBed.inject(FormBuilder);
    const pageMetamodel = createSampleEndpointMetamodel();
    const cmd = pageMetamodel.findColumn('endpointProperties');
    const idCmd = pageMetamodel.findColumn('endpointProperties.id');
    component.itemConfig = {
        group: new FormGroup({}),
        groups: null,
        parentColumn: cmd,
        field: {
            metadata: cmd,
            disabled: false,
            placeholder: '',
            type: 'text',
            validation: [],
            value: cmd.defaultValue
        },
        items : [],
        isArray: true,
        hasChilds: true
    };
    const idColumn = {
      group: new FormGroup({}),
      groups: null,
      parentColumn: cmd,
      field: {
          metadata: idCmd,
          disabled: false,
          placeholder: '',
          type: 'number',
          validation: [],
          value: idCmd.defaultValue
      },
      items : [],
      isArray: false,
      hasChilds: false
    };

    component.itemConfig.group.addControl('endpointProperties', fb.control({}));
    idColumn.group.addControl('id', fb.control({}));
    component.itemConfig.items.push(idColumn);

    component.mode = EditorMode.CREATE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
