import { TestBed } from '@angular/core/testing';

import { ServiceTechnicianService } from './service-technician.service';

describe('ServiceTechnicianService', () => {
  let service: ServiceTechnicianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTechnicianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
