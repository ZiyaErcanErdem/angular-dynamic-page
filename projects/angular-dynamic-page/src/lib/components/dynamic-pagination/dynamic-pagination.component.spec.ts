import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPaginationComponent } from './dynamic-pagination.component';

describe('DynamicPaginationComponent', () => {
  let component: DynamicPaginationComponent;
  let fixture: ComponentFixture<DynamicPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
