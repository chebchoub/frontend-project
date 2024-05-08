import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTechnicienComponent } from './tickets-technicien.component';

describe('TicketsTechnicienComponent', () => {
  let component: TicketsTechnicienComponent;
  let fixture: ComponentFixture<TicketsTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketsTechnicienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketsTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
