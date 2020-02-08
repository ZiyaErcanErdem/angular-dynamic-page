import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGridConfigurerComponent } from './dynamic-grid-configurer.component';

describe('DynamicGridConfigurerComponent', () => {
  let component: DynamicGridConfigurerComponent;
  let fixture: ComponentFixture<DynamicGridConfigurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicGridConfigurerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicGridConfigurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
