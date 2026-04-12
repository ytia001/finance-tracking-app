import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { selectAuthToken } from '../store/selectors/auth.selector';

describe('authInterceptor', () => {
  let store: MockStore;
  let nextSpy: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    nextSpy = jasmine
      .createSpy('next')
      .and.callFake((req: HttpRequest<unknown>) => of({} as HttpEvent<unknown>));
  });

  it('should add Authorization header when token is present', () => {
    store.overrideSelector(selectAuthToken, 'test-token');
    store.refreshState();

    const req = new HttpRequest('GET', '/api/test');
    TestBed.runInInjectionContext(() => authInterceptor(req, nextSpy));

    expect(nextSpy).toHaveBeenCalled();
    const capturedReq = nextSpy.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(capturedReq.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add Authorization header when no token', () => {
    store.overrideSelector(selectAuthToken, null);
    store.refreshState();

    const req = new HttpRequest('GET', '/api/test');
    TestBed.runInInjectionContext(() => authInterceptor(req, nextSpy));

    expect(nextSpy).toHaveBeenCalled();
    const capturedReq = nextSpy.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(capturedReq.headers.has('Authorization')).toBeFalse();
  });
});
