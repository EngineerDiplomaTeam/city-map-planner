import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { AuthService, User2faData } from '../../auth.service';
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
  user2faData: User2faData | undefined;
  qrCode: string | undefined;
  recoveryCodes: string[];
}

@Injectable()
export class ManageUserAccountStore extends ComponentStore<ManageUserAccountState> {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  public readonly view = this.selectSignal((state) => state.view);
  public readonly loading = this.selectSignal((state) => state.loading);

  public readonly user2faData = this.selectSignal((state) => state.user2faData);
  public readonly qrCode = this.selectSignal((state) => state.qrCode);
  public readonly recoveryCodes = this.selectSignal(
    (state) => state.recoveryCodes,
  );

  constructor() {
    super({
      loading: false,
      view: 'main',
      user2faData: undefined,
      qrCode: undefined,
      recoveryCodes: [],
    });
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
      loading: true,
      view: 'manage-2fa',
    }));

    const data = await this.authService.get2faData();

    this.patchState(() => ({
      loading: false,
      user2faData: data,
    }));
  }

  public async onEnable2Fa(): Promise<void> {
    this.patchState(() => ({
      loading: true,
    }));

    const userData = this.user2faData();
    if (!userData) return;

    const qrCode = await this.authService.getQrCode(userData.sharedKey);

    this.patchState(() => ({
      qrCode: qrCode,
      loading: false,
    }));
  }

  public async onSubmitOTP(code: string): Promise<void> {
    this.patchState(() => ({
      loading: true,
    }));

    const response = await this.authService.enable2fa(code);

    this.patchState(() => ({
      loading: false,
      recoveryCodes: response.recoveryCodes,
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
