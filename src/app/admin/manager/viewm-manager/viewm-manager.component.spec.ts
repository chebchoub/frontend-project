import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmManagerComponent } from './viewm-manager.component';

describe('ViewmManagerComponent', () => {
  let component: ViewmManagerComponent;
  let fixture: ComponentFixture<ViewmManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewmManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewmManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
