import { TestBed } from '@angular/core/testing';

import { InventarioInfraService } from './inventario-infra.service';

describe('InventarioInfraService', () => {
  let service: InventarioInfraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioInfraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
