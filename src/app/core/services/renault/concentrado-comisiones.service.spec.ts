import { TestBed } from '@angular/core/testing';

import { ConcentradoComisionesService } from './concentrado-comisiones.service';

describe('ConcentradoComisionesService', () => {
  let service: ConcentradoComisionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcentradoComisionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
