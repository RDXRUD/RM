import { TestBed } from '@angular/core/testing';

import { SkilleditService } from './skilledit.service';

describe('SkilleditService', () => {
  let service: SkilleditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkilleditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
