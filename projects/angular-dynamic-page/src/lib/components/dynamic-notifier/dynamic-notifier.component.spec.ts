import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicNotifierComponent } from './dynamic-notifier.component';

describe('DynamicNotifierComponent', () => {
  let component: DynamicNotifierComponent;
  let fixture: ComponentFixture<DynamicNotifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicNotifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
