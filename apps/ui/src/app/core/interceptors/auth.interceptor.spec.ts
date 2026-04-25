import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { JwtTokenService } from '../services/jwt-token.service';

describe('authInterceptor', () => {
  let nextSpy: jasmine.Spy<HttpHandlerFn>;
  let jwtServiceSpy: jasmine.SpyObj<JwtTokenService>;

  beforeEach(() => {
    jwtServiceSpy = jasmine.createSpyObj('JwtTokenService', ['getToken']);
    nextSpy = jasmine.createSpy('next').and.callFake(() => of({} as HttpEvent<unknown>));

    TestBed.configureTestingModule({
      providers: [{ provide: JwtTokenService, useValue: jwtServiceSpy }],
    });
  });

  it('should add Authorization header when token is present', () => {
    jwtServiceSpy.getToken.and.returnValue('test-token');

    const req = new HttpRequest('GET', '/api/test');
    TestBed.runInInjectionContext(() => authInterceptor(req, nextSpy));

    expect(nextSpy).toHaveBeenCalled();
    const capturedReq = nextSpy.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(capturedReq.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add Authorization header when no token', () => {
    jwtServiceSpy.getToken.and.returnValue(null);

    const req = new HttpRequest('GET', '/api/test');
    TestBed.runInInjectionContext(() => authInterceptor(req, nextSpy));

    expect(nextSpy).toHaveBeenCalled();
    const capturedReq = nextSpy.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(capturedReq.headers.has('Authorization')).toBeFalse();
  });
});
