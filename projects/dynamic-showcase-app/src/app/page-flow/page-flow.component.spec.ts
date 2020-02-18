import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFlowComponent } from './page-flow.component';

describe('PageFlowComponent', () => {
  let component: PageFlowComponent;
  let fixture: ComponentFixture<PageFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
