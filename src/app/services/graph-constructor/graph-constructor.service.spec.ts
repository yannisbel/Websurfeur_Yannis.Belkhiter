import { TestBed } from '@angular/core/testing';

import { GraphConstructorService } from './graph-constructor.service';

describe('GraphConstructorService', () => {
  let service: GraphConstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphConstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
