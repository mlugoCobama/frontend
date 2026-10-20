import { TestBed } from '@angular/core/testing';

import { GestionServiciosService } from './gestion-servicios.service';

describe('GestionServiciosService', () => {
  let service: GestionServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
