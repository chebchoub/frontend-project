import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentAdminComponent } from './add-comment-admin.component';

describe('AddCommentAdminComponent', () => {
  let component: AddCommentAdminComponent;
  let fixture: ComponentFixture<AddCommentAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCommentAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCommentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
