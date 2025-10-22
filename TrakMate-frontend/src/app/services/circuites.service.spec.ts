import { TestBed } from '@angular/core/testing';

import { CircuitesService } from './circuites.service';

describe('CircuitesService', () => {
  let service: CircuitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircuitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
