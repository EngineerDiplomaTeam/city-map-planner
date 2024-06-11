import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ManageTwoFactorAuthStore } from './manage-two-factor-auth.store';
import { JsonPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-manage-two-factor-auth',
  standalone: true,
  imports: [JsonPipe, MatProgressSpinner, MatButton],
  templateUrl: './manage-two-factor-auth.component.html',
  styleUrl: './manage-two-factor-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTwoFactorAuthComponent implements OnInit {
  protected readonly twoFactorAuthStore = inject(ManageTwoFactorAuthStore);
  private readonly authService = inject(AuthService);
  state = this.twoFactorAuthStore.selectSignal((state) => state.state);
  qrCodeLink = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.twoFactorAuthStore.onManage2fa();
  }

  loadQrCodeLink(): void {
    const sharedKey = this.twoFactorAuthStore.selectSignal(
      (state) => state.user2faData?.sharedKey,
    )();

    this.qrCodeLink.set(this.authService.getQrCodeLink(sharedKey!));
  }
}
