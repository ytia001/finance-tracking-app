import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthGuard } from './auth.guard';
import { selectIsAuthenticated } from '../store/selectors/auth.selector';
import { Observable } from 'rxjs';

describe('AuthGuard', () => {
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [provideMockStore(), { provide: Router, useValue: routerSpy }],
    });

    store = TestBed.inject(MockStore);
  });

  it('should allow activation when authenticated', (done) => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.refreshState();

    let result$: Observable<boolean>;
    TestBed.runInInjectionContext(() => {
      const guard = AuthGuard;
      result$ = guard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ) as Observable<boolean>;
    });

    result$!.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('should redirect to login when not authenticated', (done) => {
    store.overrideSelector(selectIsAuthenticated, false);
    routerSpy.createUrlTree.and.returnValue('/login' as unknown as UrlTree);
    store.refreshState();

    let result$: Observable<UrlTree>;
    TestBed.runInInjectionContext(() => {
      const guard = AuthGuard;
      result$ = guard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ) as Observable<UrlTree>;
    });

    result$!.subscribe(() => {
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
