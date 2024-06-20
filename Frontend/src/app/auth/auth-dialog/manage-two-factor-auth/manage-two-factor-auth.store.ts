import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { AuthService, User2faData } from '../../auth.service';
import { ManageUserAccountStore } from '../manage-user-account/manage-user-account.store';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ManageTwoFactorAuthState {
  user2faData: User2faData | null;
  state: '2fa-enabled' | '2fa-setup' | '2fa-save-recovery-codes' | 'loading';
  recoveryCodes: string[];
  qrCodeLink?: SafeResourceUrl;
}

@Injectable()
export class ManageTwoFactorAuthStore extends ComponentStore<ManageTwoFactorAuthState> {
  private readonly manageUserAccountStore = inject(ManageUserAccountStore);
  private readonly authService = inject(AuthService);
  private readonly sanitize = inject(DomSanitizer);

  constructor() {
    super({ state: 'loading', user2faData: null, recoveryCodes: [] });
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

  public async onVerify2fa(otp: string): Promise<void> {
    this.manageUserAccountStore.patchState({ loading: true });

    const response = await this.authService.verify2fa(otp);
    this.patchState({ recoveryCodes: response.recoveryCodes });

    this.manageUserAccountStore.patchState({ loading: false });
    this.patchState({ state: '2fa-save-recovery-codes' });
  }

  public async onEnable2fa() {
    this.manageUserAccountStore.patchState({ loading: true });

    const sharedKey = this.selectSignal(
      (state) => state.user2faData?.sharedKey,
    )();
    const b64QrCode = await this.authService.getQrCode(sharedKey!);
    const link = this.sanitize.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' + b64QrCode,
    );
    this.patchState({ qrCodeLink: link });

    this.manageUserAccountStore.patchState({ loading: false });
  }

  public async onDisable2fa() {
    this.manageUserAccountStore.patchState({ loading: true });

    await this.authService.disable2fa();
    this.patchState({
      state: '2fa-setup',
      qrCodeLink: undefined,
      recoveryCodes: [],
      user2faData: null,
    });

    this.manageUserAccountStore.patchState({ loading: false });
  }

  public async onRecoveryCodesReset() {
    this.manageUserAccountStore.patchState({ loading: true });

    const newRecoveryCodes = await this.authService.resetRecoveryCodes();
    this.patchState({
      state: '2fa-save-recovery-codes',
      recoveryCodes: newRecoveryCodes,
    });

    this.manageUserAccountStore.patchState({ loading: false });
  }
}
