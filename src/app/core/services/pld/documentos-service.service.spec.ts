import { TestBed } from '@angular/core/testing';

import { DocumentosServiceService } from './documentos-service.service';

describe('DocumentosServiceService', () => {
  let service: DocumentosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
