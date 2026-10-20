import { TestBed } from '@angular/core/testing';

import { EventosCitaService } from './eventos-cita.service';

describe('EventosCitaService', () => {
  let service: EventosCitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosCitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
