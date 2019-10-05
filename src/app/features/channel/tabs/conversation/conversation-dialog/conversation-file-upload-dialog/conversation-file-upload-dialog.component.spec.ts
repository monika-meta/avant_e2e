import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationFileUploadDialogComponent } from './conversation-file-upload-dialog.component';

describe('ConversationFileUploadDialogComponent', () => {
  let component: ConversationFileUploadDialogComponent;
  let fixture: ComponentFixture<ConversationFileUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationFileUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
