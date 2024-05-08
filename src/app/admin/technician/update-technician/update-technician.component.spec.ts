import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTechnicianComponent } from './update-technician.component';

describe('UpdateTechnicianComponent', () => {
  let component: UpdateTechnicianComponent;
  let fixture: ComponentFixture<UpdateTechnicianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTechnicianComponent]
    });
    fixture = TestBed.createComponent(UpdateTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
