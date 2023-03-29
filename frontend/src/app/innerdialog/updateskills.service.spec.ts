import { TestBed } from '@angular/core/testing';

import { UpdateskillsService } from './updateskills.service';

describe('UpdateskillsService', () => {
  let service: UpdateskillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateskillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
