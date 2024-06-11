import { TestBed } from '@angular/core/testing';

import { PoiService } from './poi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PoiService', () => {
  let service: PoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
