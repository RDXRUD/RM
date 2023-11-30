import { TestBed } from '@angular/core/testing';

import { AIresourcingService } from './airesourcing.service';

describe('AIresourcingService', () => {
  let service: AIresourcingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIresourcingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
