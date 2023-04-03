import { TestBed } from '@angular/core/testing';

import { AddskillService } from './addskill.service';

describe('AddskillService', () => {
  let service: AddskillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddskillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
