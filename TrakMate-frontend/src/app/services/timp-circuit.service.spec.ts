import { TestBed } from '@angular/core/testing';

import { TimpCircuitService } from './timp-circuit.service';

describe('TimpCircuitService', () => {
  let service: TimpCircuitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimpCircuitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
