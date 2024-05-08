import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContractComponent } from './edit-contract.component';

describe('EditContractComponent', () => {
  let component: EditContractComponent;
  let fixture: ComponentFixture<EditContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditContractComponent]
    });
    fixture = TestBed.createComponent(EditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
