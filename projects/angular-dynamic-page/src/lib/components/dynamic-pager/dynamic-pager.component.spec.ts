import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPagerComponent } from './dynamic-pager.component';

describe('DynamicPagerComponent', () => {
  let component: DynamicPagerComponent;
  let fixture: ComponentFixture<DynamicPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
