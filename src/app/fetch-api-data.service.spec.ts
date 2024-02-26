import { TestBed } from '@angular/core/testing';

import { fetchJeriflixAPI } from './fetch-api-data.service';

describe('fetchJeriflixAPI', () => {
  let service: fetchJeriflixAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(fetchJeriflixAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
