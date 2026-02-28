import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, createAction, props } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ToastEffects } from './toast.effects';
import { MainResourceActions } from '../actions/resources/main.actions';
import { Category } from '../../constants/Category';
import { HttpErrorResponse } from '@angular/common/http';

const testSuccessAction = createAction('[Test] Success', props<{ successMessage: string }>());
const testFailureAction = createAction('[Test] Failure', props<{ failureMessage: string }>());
const testPlainAction = createAction('[Test] Plain');

describe('ToastEffects', () => {
  let actions$: Observable<Action>;
  let effects: ToastEffects;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        ToastEffects,
        provideMockActions(() => actions$),
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    effects = TestBed.inject(ToastEffects);
  });

  describe('showSuccessToast$', () => {
    it('should call toastr.success when action has a successMessage', (done) => {
      actions$ = of(testSuccessAction({ successMessage: 'Saved!' }));

      effects.showSuccessToast$.subscribe(() => {
        expect(toastrSpy.success).toHaveBeenCalledOnceWith('Saved!');
        done();
      });
    });

    it('should not emit when action has no successMessage', (done) => {
      actions$ = of(testPlainAction());

      let emitted = false;
      effects.showSuccessToast$.subscribe(() => (emitted = true));

      setTimeout(() => {
        expect(emitted).toBeFalse();
        expect(toastrSpy.success).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should call toastr.success for saveDataEntrySuccess', (done) => {
      const entry = {
        id: 1,
        amount: '100',
        date: Date.now(),
        category: Category.INCOME,
      };
      actions$ = of(
        MainResourceActions.saveDataEntrySuccess({ data: entry, successMessage: 'Entry saved!' }),
      );

      effects.showSuccessToast$.subscribe(() => {
        expect(toastrSpy.success).toHaveBeenCalledOnceWith('Entry saved!');
        done();
      });
    });
  });

  describe('showFailureToast$', () => {
    it('should call toastr.error when action has a failureMessage', (done) => {
      actions$ = of(testFailureAction({ failureMessage: 'Something went wrong.' }));

      effects.showFailureToast$.subscribe(() => {
        expect(toastrSpy.error).toHaveBeenCalledOnceWith('Something went wrong.');
        done();
      });
    });

    it('should not emit when action has no failureMessage', (done) => {
      actions$ = of(testPlainAction());

      let emitted = false;
      effects.showFailureToast$.subscribe(() => (emitted = true));

      setTimeout(() => {
        expect(emitted).toBeFalse();
        expect(toastrSpy.error).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should call toastr.error for saveDataEntryFailure', (done) => {
      actions$ = of(
        MainResourceActions.saveDataEntryFailure({
          error: { message: 'Server error' } as HttpErrorResponse,
          failureMessage: 'Failed to save entry.',
        }),
      );

      effects.showFailureToast$.subscribe(() => {
        expect(toastrSpy.error).toHaveBeenCalledOnceWith('Failed to save entry.');
        done();
      });
    });
  });
});
