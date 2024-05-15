import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterPassworddComponent } from './enter-passwordd.component';

describe('EnterPassworddComponent', () => {
  let component: EnterPassworddComponent;
  let fixture: ComponentFixture<EnterPassworddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterPassworddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterPassworddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
