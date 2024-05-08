import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCreateEmailComponent } from './send-create-email.component';

describe('SendCreateEmailComponent', () => {
  let component: SendCreateEmailComponent;
  let fixture: ComponentFixture<SendCreateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendCreateEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendCreateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
