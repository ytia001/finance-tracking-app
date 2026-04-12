import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../../core/store/selectors/auth.selector';

/**
 * Auth Interceptor - Attaches JWT token from NgRx store to every outgoing HTTP request.
 * This is the standard approach: the interceptor reads the token from state and adds
 * an Authorization header automatically, so individual services don't need to handle it.
 */
export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const token = store.selectSignal(selectAuthToken)();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
