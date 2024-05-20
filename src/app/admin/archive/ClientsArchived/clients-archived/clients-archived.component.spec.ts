import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsArchivedComponent } from './clients-archived.component';

describe('ClientsArchivedComponent', () => {
  let component: ClientsArchivedComponent;
  let fixture: ComponentFixture<ClientsArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientsArchivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
