import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelStartComponent } from './channel-start.component';

describe('ChannelStartComponent', () => {
  let component: ChannelStartComponent;
  let fixture: ComponentFixture<ChannelStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
