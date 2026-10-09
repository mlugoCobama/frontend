import { TestBed } from '@angular/core/testing';

import { ProveedoresVehiculosService } from './proveedores-vehiculos.service';

describe('ProveedoresVehiculosService', () => {
  let service: ProveedoresVehiculosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoresVehiculosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
