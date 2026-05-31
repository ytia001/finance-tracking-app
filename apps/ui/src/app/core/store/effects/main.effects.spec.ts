import { TestBed } from '@angular/core/testing';
import { MainEffects } from './main.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { EntryModalComponent } from '../../../features/main/entry-modal/entry-modal.component';
import { TestHelpers } from '../../../test-helpers';

describe('MainEffects', () => {
  let actions$: Observable<Action>;
  let effects: MainEffects;
  let modalDialogServiceSpy: jasmine.SpyObj<ModalDialogService>;

  beforeEach(() => {
    modalDialogServiceSpy = jasmine.createSpyObj('ModalDialogService', ['open', 'close']);

    TestBed.configureTestingModule({
      providers: [
        MainEffects,
        provideMockActions(() => actions$),
        { provide: ModalDialogService, useValue: modalDialogServiceSpy },
      ],
    });

    effects = TestBed.inject(MainEffects);
  });

  it('should open dialog and dispatch saveDataEntrySuccess when dialog returns data', (done) => {
    const dialogResult = TestHelpers.createDateEntryRequest();

    modalDialogServiceSpy.open.and.returnValue(of(dialogResult));

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(modalDialogServiceSpy.open).toHaveBeenCalledWith(EntryModalComponent, {
        disableClose: true,
      });

      expect(action).toEqual(MainResourceActions.saveDataEntry({ data: dialogResult }));
      done();
    });
  });

  it('should do nothing when dialog is cancelled (returns null)', (done) => {
    modalDialogServiceSpy.open.and.returnValue(of(null));

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe({
      next: () => fail('No action should be emitted'),
      complete: () => done(),
    });
  });

  it('should dispatch error action when dialog observable errors', (done) => {
    const httpError = new HttpErrorResponse({
      error: 'Dialog failed',
    });

    modalDialogServiceSpy.open.and.returnValue(throwError(() => httpError));

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(action).toEqual(MainActions.error({ error: httpError }));
      done();
    });
  });
});
