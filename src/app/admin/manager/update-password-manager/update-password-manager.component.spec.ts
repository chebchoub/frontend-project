import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordManagerComponent } from './update-password-manager.component';

describe('UpdatePasswordManagerComponent', () => {
  let component: UpdatePasswordManagerComponent;
  let fixture: ComponentFixture<UpdatePasswordManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePasswordManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePasswordManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
