import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store, StoreModule } from '@ngrx/store';
import { LoginModalComponent } from './login-modal.component';
import { AUTH_FEATURE_KEY, authReducer } from '../../../core/store/reducers/auth.reducer';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModalService } from '../../../core/services/modal.service';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let store: Store;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LoginModalComponent>>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    modalServiceSpy = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
        LoginModalComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ModalService, useValue: modalServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.invalid).toBeTrue();
    expect(component.loading()).toBeFalse();
  });

  it('should have an invalid form with invalid email', () => {
    component.loginForm.patchValue({ email: 'not-an-email', password: 'password123' });
    expect(component.loginForm.get('email')?.valid).toBeFalse();
  });

  it('should have an invalid form with short password', () => {
    component.loginForm.patchValue({ email: 'test@test.com', password: 'short' });
    expect(component.loginForm.get('password')?.valid).toBeFalse();
  });

  it('should have a valid form with correct values', () => {
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password123' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should close dialog when closeDialog is called', () => {
    component.closeDialog();
  });

  it('should dispatch login when saveDialog is called with valid form', () => {
    spyOn(store, 'dispatch');
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password123' });
    component.saveDialog();
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Auth] Login',
        email: 'test@test.com',
        password: 'password123',
      }),
    );
  });

  it('should not dispatch login when form is invalid', () => {
    spyOn(store, 'dispatch');
    component.loginForm.patchValue({ email: 'invalid', password: '' });
    component.saveDialog();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should handle switch to register when onSwitchToRegister is called', () => {
    component.onSwitchToRegister();
  });
});
