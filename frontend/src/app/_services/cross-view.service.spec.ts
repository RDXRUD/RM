import { TestBed } from '@angular/core/testing';

import { CrossViewService } from './cross-view.service';

describe('CrossViewService', () => {
  let service: CrossViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrossViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
