import { TestBed } from '@angular/core/testing';

import { SVGService } from './svg.service';

describe('SVGService', () => {
  let service: SVGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SVGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
