import { TestBed } from '@angular/core/testing';

import { VolumetricosExportServiceService } from './volumetricos-export-service.service';

describe('VolumetricosExportServiceService', () => {
  let service: VolumetricosExportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumetricosExportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
