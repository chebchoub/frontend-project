import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienRegisterComponent } from './technicien-register.component';

describe('TechnicienRegisterComponent', () => {
  let component: TechnicienRegisterComponent;
  let fixture: ComponentFixture<TechnicienRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicienRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicienRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
