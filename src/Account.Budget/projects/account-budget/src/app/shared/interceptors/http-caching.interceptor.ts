// #docplaster
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, startWith, tap } from 'rxjs';

import { RequestCache } from '@account/budget/services';

/**
 * If request is cacheable (e.g., package search) and
 * response is in cache return the cached response as observable.
 * If has 'x-refresh' header that is true,
 * then also re-run the package search, using response from next(),
 * returning an observable that emits the cached response first.
 *
 * If not in cache or not cacheable,
 * pass request through to next()
 */
// #docregion v1
@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cacheable.
    if (!isCacheable(req)) {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req);
    // #enddocregion v1
    // #docregion intercept-refresh
    // cache-then-refresh
    if (req.headers.get('x-refresh')) {
      const results$ = sendRequest(req, next, this.cache);
      return cachedResponse ? results$.pipe(startWith(cachedResponse)) : results$;
    }
    // cache-or-fetch
    // #docregion v1
    return cachedResponse ? of(cachedResponse) : sendRequest(req, next, this.cache);
    // #enddocregion intercept-refresh
  }
}
// #enddocregion v1

/** Is this request cacheable? */
function isCacheable(req: HttpRequest<any>) {
  // Only GET requests are cacheable
  return req.method === 'GET';
}

// #docregion send-request
/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(
    tap(event => {
      // There may be other events besides the response.
      if (event instanceof HttpResponse) {
        cache.put(req, event); // Update the cache.
      }
    }),
  );
}
// #enddocregion send-request
