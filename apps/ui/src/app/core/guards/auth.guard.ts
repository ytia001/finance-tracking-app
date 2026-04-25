import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../store/selectors/auth.selector';

/**
 * Auth Guard - Prevents unauthenticated users from accessing protected routes.
 * If not authenticated, redirects to /login.
 *
 * Note: This is a CLIENT-SIDE guard. It provides UX protection by preventing
 * unauthorized navigation. The BACKEND also has its own JwtAuthGuard (global),
 * which is the real security layer — even if a hacker bypasses this guard,
 * the backend will reject requests without a valid JWT.
 *
 * Having BOTH is the standard/secure approach:
 * - Frontend guard = good UX, prevents unnecessary API calls
 * - Backend guard = real security, enforces authentication
 */
export const AuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
  );
};
