import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelConversationComponent } from './conversation.component';

describe('ConversationComponent', () => {
  let component: ChannelConversationComponent;
  let fixture: ComponentFixture<ChannelConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
