import { TestBed } from '@angular/core/testing';

import { ServiceUserNotifService } from './service-user-notif.service';

describe('ServiceUserNotifService', () => {
  let service: ServiceUserNotifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceUserNotifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
