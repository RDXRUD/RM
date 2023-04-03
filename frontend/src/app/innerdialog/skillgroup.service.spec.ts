import { TestBed } from '@angular/core/testing';

import { SkillgroupService } from './skillgroup.service';

describe('SkillgroupService', () => {
  let service: SkillgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
