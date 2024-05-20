import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsArchivedComponent } from './contracts-archived.component';

describe('ContractsArchivedComponent', () => {
  let component: ContractsArchivedComponent;
  let fixture: ComponentFixture<ContractsArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractsArchivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractsArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
