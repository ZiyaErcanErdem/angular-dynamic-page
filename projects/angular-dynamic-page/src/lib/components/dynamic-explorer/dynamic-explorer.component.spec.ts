import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExplorerComponent } from './dynamic-explorer.component';

describe('DynamicExplorerComponent', () => {
  let component: DynamicExplorerComponent;
  let fixture: ComponentFixture<DynamicExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
