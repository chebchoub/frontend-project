import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerArchivedComponent } from './manager-archived.component';

describe('ManagerArchivedComponent', () => {
  let component: ManagerArchivedComponent;
  let fixture: ComponentFixture<ManagerArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerArchivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
