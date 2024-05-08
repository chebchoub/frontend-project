import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTicketComponent } from './assigned-ticket.component';

describe('AssignedTicketComponent', () => {
  let component: AssignedTicketComponent;
  let fixture: ComponentFixture<AssignedTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedTicketComponent]
    });
    fixture = TestBed.createComponent(AssignedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
