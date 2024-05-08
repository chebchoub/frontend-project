import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfilePasswordComponent } from './update-profile-password.component';

describe('UpdateProfilePasswordComponent', () => {
  let component: UpdateProfilePasswordComponent;
  let fixture: ComponentFixture<UpdateProfilePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateProfilePasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProfilePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
