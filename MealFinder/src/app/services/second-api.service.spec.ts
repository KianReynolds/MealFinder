import { TestBed } from '@angular/core/testing';

import { SecondApiService } from './second-api.service';

describe('SecondApiService', () => {
  let service: SecondApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
