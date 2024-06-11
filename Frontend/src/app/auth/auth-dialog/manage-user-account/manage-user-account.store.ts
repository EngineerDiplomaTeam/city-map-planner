import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from '../../auth.actions';

export interface ManageUserAccountState {
  loading: boolean;
  view:
    | 'main'
    | 'logout'
    | 'change-email-or-password'
    | 'manage-2fa'
    | 'delete-me';
}

@Injectable()
export class ManageUserAccountStore extends ComponentStore<ManageUserAccountState> {
  private readonly store = inject(Store);
  public readonly view = this.selectSignal((state) => state.view);
  public readonly loading = this.selectSignal((state) => state.loading);

  constructor() {
    super({ loading: false, view: 'main' });
  }

  public onLogout(): void {
    this.patchState(() => ({
      loading: true,
      view: 'logout',
    }));

    // Leave loading state, until user is fully logged out
    this.store.dispatch(authActions.logout());
  }

  public onChangeEmailOrPassword(): void {
    this.patchState(() => ({
      view: 'change-email-or-password',
    }));
  }

  public onChangeCredentialsFormSubmit(email: string, password: string) {
    console.log(email, password); // TODO: Implement change email or password, leverage `POST:Api/Manage/Info` endpoint
  }

  public async onManage2fa(): Promise<void> {
    this.patchState(() => ({
      view: 'manage-2fa',
    }));
  }

  public async onDeleteMe(): Promise<void> {
    this.patchState(() => ({
      loading: true,
      view: 'delete-me',
    }));

    // Leave loading state, until user is fully wiped out
    this.store.dispatch(authActions.deleteMe());
  }
}
