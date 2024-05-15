import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailCreateManagerComponent } from './send-email-create-manager.component';

describe('SendEmailCreateManagerComponent', () => {
  let component: SendEmailCreateManagerComponent;
  let fixture: ComponentFixture<SendEmailCreateManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendEmailCreateManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendEmailCreateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
