import { TestBed } from '@angular/core/testing';
import { MainEffects } from './main.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { EntryModalComponent } from '../../../features/main/entry-modal/entry-modal.component';
import { ModalConstants } from '../../constants/Modal';
import { TestHelpers } from '../../../test-helpers';

describe('MainEffects', () => {
  let actions$: Observable<Action>;
  let effects: MainEffects;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EntryModalComponent>>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<EntryModalComponent, string | null>>(
      'MatDialogRef',
      ['afterClosed'],
    );

    TestBed.configureTestingModule({
      providers: [
        MainEffects,
        provideMockActions(() => actions$),
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    effects = TestBed.inject(MainEffects);
  });

  it('should open dialog and dispatch saveDataEntrySuccess when dialog returns data', (done) => {
    const dialogResult = TestHelpers.createDateEntryRequest();

    dialogRefSpy.afterClosed.and.returnValue(of(dialogResult));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(dialogSpy.open).toHaveBeenCalledWith(
        EntryModalComponent,
        jasmine.objectContaining({
          disableClose: true,
          width: ModalConstants.MODAL_WIDTH_PERCENTAGE,
          height: ModalConstants.MODAL_HEIGHT_PERCENTAGE,
        }),
      );

      expect(action).toEqual(MainResourceActions.saveDataEntry({ data: dialogResult }));
      done();
    });
  });

  it('should do nothing when dialog is cancelled (returns null)', (done) => {
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    dialogSpy.open.and.returnValue(dialogRefSpy);

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

    dialogRefSpy.afterClosed.and.returnValue(throwError(() => httpError));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(action).toEqual(MainActions.error({ error: httpError }));
      done();
    });
  });
});
