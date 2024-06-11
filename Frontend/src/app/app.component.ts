import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from './auth/auth.actions';
import { poiActions } from './poi/poi.actions';
import { selectPoiInBasketCount } from './poi/poi.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly authActions = authActions;
  protected readonly store = inject(Store);
  protected readonly basketCount = this.store.selectSignal(
    selectPoiInBasketCount,
  );

  constructor() {
    this.store.dispatch(authActions.loadUserFromLocalStorage());
  }

  protected readonly poiActions = poiActions;
}
