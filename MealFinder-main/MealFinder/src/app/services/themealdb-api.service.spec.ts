import { TestBed } from '@angular/core/testing';
import { themealdbApiService } from './themealdb-api.service';

describe('OmdbApiService', () => {
  let service: themealdbApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(themealdbApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
