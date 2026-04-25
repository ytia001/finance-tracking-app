import { TestBed } from '@angular/core/testing';
import { MainEffects } from './main.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { MainActions } from '../actions/main.actions';
import { MainResourceActions } from '../actions/resources/main.actions';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../constants/Category';

describe('MainEffects', () => {
  let actions$: Observable<Action>;
  let effects: MainEffects;
  let dialogServiceSpy: jasmine.SpyObj<TuiDialogService>;

  beforeEach(() => {
    dialogServiceSpy = jasmine.createSpyObj('TuiDialogService', ['open']);

    TestBed.configureTestingModule({
      providers: [
        MainEffects,
        provideMockActions(() => actions$),
        { provide: TuiDialogService, useValue: dialogServiceSpy },
      ],
    });

    effects = TestBed.inject(MainEffects);
  });

  it('should open dialog and dispatch saveDataEntrySuccess when dialog returns data', (done) => {
    const dialogResult = { category: Category.INCOME, amount: 100, date: new Date() };

    dialogServiceSpy.open.and.returnValue(of(dialogResult));

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(action).toEqual(MainResourceActions.saveDataEntry({ data: dialogResult }));
      done();
    });
  });

  it('should dispatch error when dialog is cancelled (returns null)', (done) => {
    dialogServiceSpy.open.and.returnValue(of(null));

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(action.type).toBe(MainActions.error.type);
      done();
    });
  });

  it('should dispatch error action when dialog observable errors', (done) => {
    const httpError = new HttpErrorResponse({
      error: 'Dialog failed',
    });

    dialogServiceSpy.open.and.returnValue(throwError(() => httpError));

    actions$ = of(MainActions.openAddDataEntryModal());

    effects.openAddDataEntryModal$.subscribe((action) => {
      expect(action).toEqual(MainActions.error({ error: httpError }));
      done();
    });
  });
});
