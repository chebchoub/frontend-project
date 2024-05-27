import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterPasswordManagerComponent } from './enter-password-manager.component';

describe('EnterPasswordManagerComponent', () => {
  let component: EnterPasswordManagerComponent;
  let fixture: ComponentFixture<EnterPasswordManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterPasswordManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterPasswordManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
