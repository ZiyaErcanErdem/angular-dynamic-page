import { TestBed } from '@angular/core/testing';

import { DynamicMetamodelService } from './dynamic-metamodel.service';

describe('DynamicMetamodelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicMetamodelService = TestBed.get(DynamicMetamodelService);
    expect(service).toBeTruthy();
  });
});
