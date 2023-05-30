import { TestBed } from '@angular/core/testing';
import { SkillgroupService } from '../innerdialog/skillgroup.service';

describe('SGService', () => {
  let service: SkillgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
