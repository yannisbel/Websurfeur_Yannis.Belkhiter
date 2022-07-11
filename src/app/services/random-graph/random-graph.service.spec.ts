import { TestBed } from '@angular/core/testing';

import { RandomGraphService } from './random-graph.service';

describe('RandomGraphService', () => {
  let service: RandomGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
