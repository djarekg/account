import { TestBed } from '@angular/core/testing';

import { HttpAuthInterceptor } from './http-auth.interceptor';

describe('HttpAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpAuthInterceptor = TestBed.inject(HttpAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
