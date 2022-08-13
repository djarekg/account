import { TestBed } from '@angular/core/testing';

import { HttpCachingInterceptor } from './http-caching.interceptor';

describe('HttpCachingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpCachingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpCachingInterceptor = TestBed.inject(HttpCachingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
