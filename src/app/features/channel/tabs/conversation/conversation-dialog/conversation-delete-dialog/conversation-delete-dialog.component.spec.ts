import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationDeleteDialogComponent } from './conversation-delete-dialog.component';

describe('ConversationDeleteDialogComponent', () => {
  let component: ConversationDeleteDialogComponent;
  let fixture: ComponentFixture<ConversationDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
