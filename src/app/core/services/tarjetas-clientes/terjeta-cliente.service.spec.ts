import { TestBed } from '@angular/core/testing';

import { TerjetaClienteService } from './terjeta-cliente.service';

describe('TerjetaClienteService', () => {
  let service: TerjetaClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerjetaClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
