import { TestBed } from '@angular/core/testing';

import { AsingTokensUcoipService } from './asing-tokens-ucoip.service';

describe('AsingTokensUcoipService', () => {
  let service: AsingTokensUcoipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsingTokensUcoipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
