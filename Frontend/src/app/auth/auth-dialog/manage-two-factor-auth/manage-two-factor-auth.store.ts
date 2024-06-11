import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { AuthService, User2faData } from '../../auth.service';
import { ManageUserAccountStore } from '../manage-user-account/manage-user-account.store';

export interface ManageTwoFactorAuthState {
  user2faData: User2faData | null;
  state: '2fa-enabled' | '2fa-setup' | '2fa-save-recovery-codes' | 'loading';
}

@Injectable()
export class ManageTwoFactorAuthStore extends ComponentStore<ManageTwoFactorAuthState> {
  private readonly manageUserAccountStore = inject(ManageUserAccountStore);
  private readonly authService = inject(AuthService);

  constructor() {
    super({ state: 'loading', user2faData: null });
  }

  public async onManage2fa(): Promise<void> {
    this.manageUserAccountStore.patchState({ loading: true });

    const data = await this.authService.get2faData();
    this.patchState({ user2faData: data });

    if (data.isTwoFactorEnabled) {
      this.patchState({ state: '2fa-enabled' });
    } else {
      this.patchState({ state: '2fa-setup' });
    }

    this.manageUserAccountStore.patchState({ loading: false });
  }
}
