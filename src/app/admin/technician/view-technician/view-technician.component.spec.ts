import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTechnicianComponent } from './view-technician.component';

describe('ViewTechnicianComponent', () => {
  let component: ViewTechnicianComponent;
  let fixture: ComponentFixture<ViewTechnicianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTechnicianComponent]
    });
    fixture = TestBed.createComponent(ViewTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
