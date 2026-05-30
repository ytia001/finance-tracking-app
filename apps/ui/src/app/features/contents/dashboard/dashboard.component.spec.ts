import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectDashboardEntries } from '../../../core/store/selectors/dashboard.selector';
import { TestHelpers } from '../../../test-helpers';
import { Category } from '../../../core/constants/Category';
import { DataEntry } from '../../../models/DataEntry';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;

  const setupWithState = async (entries: DataEntry[] = []) => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideCharts(withDefaultRegisterables()),
        provideMockStore({
          selectors: [{ selector: selectDashboardEntries, value: entries }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    await setupWithState();
    expect(component).toBeTruthy();
  });

  it('should emit empty entries when store has no data', async () => {
    await setupWithState([]);
    component.entries$.subscribe((entries) => {
      expect(entries.length).toBe(0);
    });
  });

  it('should emit correct entries from the store', async () => {
    const entries = [
      TestHelpers.createDataEntry({ id: 1, category: Category.INCOME, amount: '500' }),
      TestHelpers.createDataEntry({ id: 2, category: Category.FOOD_AND_BEVERAGE, amount: '80' }),
    ] as DataEntry[];
    await setupWithState(entries);
    component.entries$.subscribe((result) => {
      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  it('should reflect updated entries when store changes', async () => {
    await setupWithState([]);

    const newEntries = [
      TestHelpers.createDataEntry({ id: 10, category: Category.TRANSPORT, amount: '30' }),
    ];
    store.overrideSelector(selectDashboardEntries, newEntries);
    store.refreshState();
    fixture.detectChanges();

    component.entries$.subscribe((result) => {
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(10);
    });
  });
});
