import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTechnicianComponent } from './home-technician.component';

describe('HomeTechnicianComponent', () => {
  let component: HomeTechnicianComponent;
  let fixture: ComponentFixture<HomeTechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTechnicianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
