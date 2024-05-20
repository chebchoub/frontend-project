import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienArchivedComponent } from './technicien-archived.component';

describe('TechnicienArchivedComponent', () => {
  let component: TechnicienArchivedComponent;
  let fixture: ComponentFixture<TechnicienArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicienArchivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicienArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
