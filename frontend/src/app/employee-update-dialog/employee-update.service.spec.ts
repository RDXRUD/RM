import { TestBed } from '@angular/core/testing';

import { EmployeeUpdateService } from './employee-update.service';

describe('EmployeeUpdateService', () => {
  let service: EmployeeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
