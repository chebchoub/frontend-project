import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTechnicienComponent } from './profile-technicien.component';

describe('ProfileTechnicienComponent', () => {
  let component: ProfileTechnicienComponent;
  let fixture: ComponentFixture<ProfileTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileTechnicienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
