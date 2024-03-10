import { TestBed } from '@angular/core/testing';

import { PoiServiceService } from './poi-service.service';

describe('PoiServiceService', () => {
  let service: PoiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
