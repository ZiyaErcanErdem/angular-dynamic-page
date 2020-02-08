import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentViewComponent } from './dynamic-content-view.component';

describe('DynamicContentViewComponent', () => {
  let component: DynamicContentViewComponent;
  let fixture: ComponentFixture<DynamicContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicContentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
