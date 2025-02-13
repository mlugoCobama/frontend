import { TestBed } from '@angular/core/testing';

import { OrdenesCompraService } from './ordenes-compra.service';

describe('OrdenesCompraService', () => {
  let service: OrdenesCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
