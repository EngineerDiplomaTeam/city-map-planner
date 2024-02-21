import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from './auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly authActions = authActions;
  protected readonly store = inject(Store);

  constructor() {
    this.store.dispatch(authActions.loadUserFromLocalStorage());
  }
}
