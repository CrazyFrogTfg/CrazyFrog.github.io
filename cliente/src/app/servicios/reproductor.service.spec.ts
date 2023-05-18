import { TestBed } from '@angular/core/testing';

import { ReproductorService } from './reproductor.service';

describe('ReproductorService', () => {
  let service: ReproductorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReproductorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
