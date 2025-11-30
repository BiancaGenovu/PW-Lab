import { TestBed } from '@angular/core/testing';

import { EvolutiaMeaService } from './evolutia-mea.service';

describe('EvolutiaMeaService', () => {
  let service: EvolutiaMeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvolutiaMeaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
