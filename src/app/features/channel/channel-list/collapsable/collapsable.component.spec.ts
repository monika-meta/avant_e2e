import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelListCollapsableComponent } from './collapsable.component';

describe('ChannelListCollapsableComponent', () => {
  let component: ChannelListCollapsableComponent;
  let fixture: ComponentFixture<ChannelListCollapsableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelListCollapsableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelListCollapsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
