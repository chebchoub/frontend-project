import { TestBed } from '@angular/core/testing';

import { ServiceClientsService } from './service-clients.service';

describe('ServiceClientsService', () => {
  let service: ServiceClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
