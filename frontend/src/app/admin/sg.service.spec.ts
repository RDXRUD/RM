import { TestBed } from '@angular/core/testing';

import { SGService } from './sg.service';

describe('SGService', () => {
  let service: SGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
