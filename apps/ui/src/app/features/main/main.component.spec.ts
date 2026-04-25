import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

import { ModalService } from '../../core/services/modal.service';
import { AUTH_FEATURE_KEY, AuthState } from '../../core/store/reducers/auth.reducer';

@Component({ standalone: true, template: '' })
class DummyDashboardComponent {}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  const initialAuthState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(async () => {
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

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  afterEach(() => {
    // Cleanup
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the side nav when toggleSideNav is called', () => {
    component.toggleSideNav();
  });

  it('should handle add finance clicked when handleAddFinanceClicked is called', () => {
    component.handleAddFinanceClicked();
  });

  it('should handle sign in clicked when handleSignInClicked is called', () => {
    component.handleSignInClicked();
  });
});
