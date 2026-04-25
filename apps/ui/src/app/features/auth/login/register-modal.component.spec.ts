import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store, StoreModule } from '@ngrx/store';
import { RegisterModalComponent } from './register-modal.component';
import { AUTH_FEATURE_KEY, authReducer } from '../../../core/store/reducers/auth.reducer';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModalService } from '../../../core/services/modal.service';
import { LoginModalComponent } from './login-modal.component';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let store: Store;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<RegisterModalComponent>>;
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
        RegisterModalComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ModalService, useValue: modalServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.registerForm.invalid).toBeTrue();
    expect(component.loading()).toBeFalse();
  });

  it('should have an invalid form with short firstName', () => {
    component.registerForm.patchValue({
      firstName: 'J',
      lastName: 'Doe',
      email: 'test@test.com',
      password: 'password123',
    });
    expect(component.registerForm.get('firstName')?.valid).toBeFalse();
  });

  it('should have an invalid form with short lastName', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'D',
      email: 'test@test.com',
      password: 'password123',
    });
    expect(component.registerForm.get('lastName')?.valid).toBeFalse();
  });

  it('should have an invalid form with invalid email', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(component.registerForm.get('email')?.valid).toBeFalse();
  });

  it('should have an invalid form with short password', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      password: 'short',
    });
    expect(component.registerForm.get('password')?.valid).toBeFalse();
  });

  it('should have a valid form with correct values', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      password: 'password123',
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should close dialog when closeDialog is called', () => {
    component.closeDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
  });

  it('should dispatch register action when saveDialog is called with valid form', () => {
    spyOn(store, 'dispatch');
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      password: 'password123',
    });
    component.saveDialog();
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Auth] Register',
        data: {
          email: 'test@test.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        },
      }),
    );
  });

  it('should not dispatch register when form is invalid', () => {
    spyOn(store, 'dispatch');
    component.registerForm.patchValue({
      firstName: '',
      lastName: '',
      email: 'invalid',
      password: '',
    });
    component.saveDialog();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should lowercase email before dispatching', () => {
    spyOn(store, 'dispatch');
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'TEST@TEST.COM',
      password: 'password123',
    });
    component.saveDialog();
    const dispatchedAction = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
    expect(dispatchedAction.data.email).toBe('test@test.com');
  });

  it('should trim names before dispatching', () => {
    spyOn(store, 'dispatch');
    component.registerForm.patchValue({
      firstName: '  John  ',
      lastName: '  Doe  ',
      email: 'test@test.com',
      password: 'password123',
    });
    component.saveDialog();
    const dispatchedAction = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
    expect(dispatchedAction.data.firstName).toBe('John');
    expect(dispatchedAction.data.lastName).toBe('Doe');
  });

  it('should close modal with login and open login modal when onSwitchToLogin is called', () => {
    component.onSwitchToLogin();
    expect(modalServiceSpy.closeModal).toHaveBeenCalledWith('login');
    expect(modalServiceSpy.openModal).toHaveBeenCalledWith(LoginModalComponent);
  });
});
