import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsClientComponent } from './tickets-client.component';

describe('TicketsClientComponent', () => {
  let component: TicketsClientComponent;
  let fixture: ComponentFixture<TicketsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketsClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
