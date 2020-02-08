import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseElementViewComponent } from './base-element-view.component';

describe('BaseElementViewComponent', () => {
  let component: BaseElementViewComponent;
  let fixture: ComponentFixture<BaseElementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseElementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseElementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
