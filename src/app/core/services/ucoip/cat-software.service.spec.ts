import { TestBed } from '@angular/core/testing';

import { CatSoftwareService } from './cat-software.service';

describe('CatSoftwareService', () => {
  let service: CatSoftwareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatSoftwareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
