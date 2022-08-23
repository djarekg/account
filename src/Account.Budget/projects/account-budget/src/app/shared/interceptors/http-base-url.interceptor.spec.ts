import { TestBed } from '@angular/core/testing';

import { HttpBaseUrlInterceptor } from './http-base-url.interceptor';

describe('HttpBaseUrlInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpBaseUrlInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpBaseUrlInterceptor = TestBed.inject(HttpBaseUrlInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
