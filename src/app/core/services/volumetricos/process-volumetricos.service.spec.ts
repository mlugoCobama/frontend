import { TestBed } from '@angular/core/testing';

import { ProcessVolumetricosService } from './process-volumetricos.service';

describe('ProcessVolumetricosService', () => {
  let service: ProcessVolumetricosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessVolumetricosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
