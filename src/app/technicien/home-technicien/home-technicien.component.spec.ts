import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTechnicienComponent } from './home-technicien.component';

describe('HomeTechnicienComponent', () => {
  let component: HomeTechnicienComponent;
  let fixture: ComponentFixture<HomeTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTechnicienComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
