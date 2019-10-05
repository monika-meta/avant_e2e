import { TestBed } from '@angular/core/testing';

import { WindowNotificationService } from './window-notification.service';

describe('WindowNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WindowNotificationService = TestBed.get(WindowNotificationService);
    expect(service).toBeTruthy();
  });
});
