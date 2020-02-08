import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPortalComponent } from './dynamic-portal.component';

describe('DynamicPortalComponent', () => {
  let component: DynamicPortalComponent;
  let fixture: ComponentFixture<DynamicPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
