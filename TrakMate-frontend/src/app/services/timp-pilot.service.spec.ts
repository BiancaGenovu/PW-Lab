import { TestBed } from '@angular/core/testing';

import { TimpPilotService } from './timp-pilot.service';

describe('TimpPilotService', () => {
  let service: TimpPilotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimpPilotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
