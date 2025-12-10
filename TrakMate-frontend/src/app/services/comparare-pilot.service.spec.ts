import { TestBed } from '@angular/core/testing';

import { CompararePilotService } from './comparare-pilot.service';

describe('CompararePilotService', () => {
  let service: CompararePilotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompararePilotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
