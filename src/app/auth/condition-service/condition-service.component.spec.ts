import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionServiceComponent } from './condition-service.component';

describe('ConditionServiceComponent', () => {
  let component: ConditionServiceComponent;
  let fixture: ComponentFixture<ConditionServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConditionServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConditionServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
