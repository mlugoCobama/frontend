import { TestBed } from '@angular/core/testing';

import { TokensAgenciasService } from './tokens-agencias.service';

describe('TokensAgenciasService', () => {
  let service: TokensAgenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokensAgenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
