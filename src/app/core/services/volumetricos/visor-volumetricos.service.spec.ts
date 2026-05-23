import { TestBed } from '@angular/core/testing';

import { VisorVolumetricosService } from './visor-volumetricos.service';

describe('VisorVolumetricosService', () => {
  let service: VisorVolumetricosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisorVolumetricosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
