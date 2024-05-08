import { TestBed } from '@angular/core/testing';

import { ServiceContratService } from './service-contrat.service';

describe('ServiceContratService', () => {
  let service: ServiceContratService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceContratService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
