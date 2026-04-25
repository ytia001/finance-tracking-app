import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * API Prefix Interceptor — Prepends /api to every outgoing HTTP request.
 * This avoids hardcoding /api in every service URL.
 */
export const apiPrefixInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const apiReq = req.clone({ url: `/api${req.url}` });
  return next(apiReq);
};
