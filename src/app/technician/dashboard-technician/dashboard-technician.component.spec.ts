import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTechnicianComponent } from './dashboard-technician.component';

describe('DashboardTechnicianComponent', () => {
  let component: DashboardTechnicianComponent;
  let fixture: ComponentFixture<DashboardTechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardTechnicianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
