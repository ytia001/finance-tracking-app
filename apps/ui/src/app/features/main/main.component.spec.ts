import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { MainActions } from '../../core/store/actions/main.actions';

import { ModalService } from '../../core/services/modal.service';
import { AUTH_FEATURE_KEY, AuthState } from '../../core/store/reducers/auth.reducer';
import { LoginModalComponent } from '../../features/auth/login/login-modal.component';

@Component({ standalone: true, template: '' })
class DummyDashboardComponent {}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
  let sidenavSpy: jasmine.SpyObj<MatSidenav>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  const initialAuthState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(async () => {
    sidenavSpy = jasmine.createSpyObj('MatSidenav', ['toggle']);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['openModal']);

    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([{ path: 'dashboard', component: DummyDashboardComponent }]),
        provideMockStore({
          initialState: {
            [AUTH_FEATURE_KEY]: initialAuthState,
          },
        }),
        { provide: ModalService, useValue: modalServiceSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.sideNavComp = sidenavSpy;

    await fixture.whenStable();
  });

  afterEach(() => {
    sidenavSpy.toggle.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the side nav when toggleSideNav is called', () => {
    component.toggleSideNav();

    expect(sidenavSpy.toggle).toHaveBeenCalled();
  });

  it('should dispatch openAddDataEntryModal action when handleAddFinanceClicked is called', () => {
    store.setState({
      [AUTH_FEATURE_KEY]: {
        ...initialAuthState,
        isAuthenticated: true,
      },
    });
    store.refreshState();
    fixture.detectChanges();
    dispatchSpy.calls.reset();

    component.handleAddFinanceClicked();

    expect(dispatchSpy).toHaveBeenCalledWith(MainActions.openAddDataEntryModal());
  });

  it('should open login modal when handleSignInClicked is called', () => {
    fixture.detectChanges();
    component.handleSignInClicked();

    expect(modalServiceSpy.openModal).toHaveBeenCalledWith(LoginModalComponent);
  });
});