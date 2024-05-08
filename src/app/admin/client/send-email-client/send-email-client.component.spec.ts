import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailClientComponent } from './send-email-client.component';

describe('SendEmailClientComponent', () => {
  let component: SendEmailClientComponent;
  let fixture: ComponentFixture<SendEmailClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailClientComponent]
    });
    fixture = TestBed.createComponent(SendEmailClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
