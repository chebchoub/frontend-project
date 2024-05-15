import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentClientComponent } from './add-comment-client.component';

describe('AddCommentClientComponent', () => {
  let component: AddCommentClientComponent;
  let fixture: ComponentFixture<AddCommentClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCommentClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCommentClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
