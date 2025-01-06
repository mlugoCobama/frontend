import { TestBed } from '@angular/core/testing';

import { CatUnidadesMedidasService } from '../../../../cat-unidades-medidas.service';

describe('CatUnidadesMedidasService', () => {
  let service: CatUnidadesMedidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatUnidadesMedidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
