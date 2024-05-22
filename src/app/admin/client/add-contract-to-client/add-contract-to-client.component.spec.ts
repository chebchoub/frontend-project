import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractToClientComponent } from './add-contract-to-client.component';

describe('AddContractToClientComponent', () => {
  let component: AddContractToClientComponent;
  let fixture: ComponentFixture<AddContractToClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddContractToClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContractToClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
