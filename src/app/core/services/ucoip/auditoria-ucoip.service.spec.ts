import { TestBed } from '@angular/core/testing';

import { AuditoriaUcoipService } from './auditoria-ucoip.service';

describe('AuditoriaUcoipService', () => {
  let service: AuditoriaUcoipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditoriaUcoipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
