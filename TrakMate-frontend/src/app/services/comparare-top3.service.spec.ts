import { TestBed } from '@angular/core/testing';

import { ComparareTop3Service } from './comparare-top3.service';

describe('ComparareTop3Service', () => {
  let service: ComparareTop3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparareTop3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
