import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingTicketComponent } from './rating-ticket.component';

describe('RatingTicketComponent', () => {
  let component: RatingTicketComponent;
  let fixture: ComponentFixture<RatingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
