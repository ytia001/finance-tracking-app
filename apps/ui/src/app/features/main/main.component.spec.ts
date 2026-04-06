import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { MainActions } from '../../core/store/actions/main.actions';

@Component({ standalone: true, template: '' })
class DummyDashboardComponent {}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: MockStore;
  let sidenavSpy: jasmine.SpyObj<MatSidenav>;

  beforeEach(async () => {
    sidenavSpy = jasmine.createSpyObj('MatSidenav', ['toggle']);

    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        provideRouter([{ path: 'dashboard', component: DummyDashboardComponent }]),
        provideMockStore(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges(); // run lifecycle hooks, Angular sets @ViewChild

    // Manually assign the spy after detectChanges() because Angular overwrites @ViewChild properties during ngAfterViewInit
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
    spyOn(store, 'dispatch');

    component.handleAddFinanceClicked();

    expect(store.dispatch).toHaveBeenCalledWith(MainActions.openAddDataEntryModal());
  });
});
