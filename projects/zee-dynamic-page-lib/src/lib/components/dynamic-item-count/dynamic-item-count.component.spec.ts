import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicItemCountComponent } from './dynamic-item-count.component';

describe('DynamicItemCountComponent', () => {
  let component: DynamicItemCountComponent;
  let fixture: ComponentFixture<DynamicItemCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicItemCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicItemCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
