import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTextboxComponent } from './message.textbox.component';

describe('Message.TextboxComponent', () => {
  let component: Message.TextboxComponent;
  let fixture: ComponentFixture<Message.TextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Message.TextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Message.TextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
