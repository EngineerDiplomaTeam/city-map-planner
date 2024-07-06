import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ManageTwoFactorAuthStore } from './manage-two-factor-auth.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manage-two-factor-auth',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButton,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-two-factor-auth.component.html',
  styleUrl: './manage-two-factor-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTwoFactorAuthComponent implements OnInit {
  protected readonly twoFactorAuthStore = inject(ManageTwoFactorAuthStore);

  state = this.twoFactorAuthStore.selectSignal((state) => state.state);
  recoveryCodes = this.twoFactorAuthStore.selectSignal(
    (state) => state.recoveryCodes,
  );
  qrCodeLink = this.twoFactorAuthStore.selectSignal(
    (state) => state.qrCodeLink,
  );

  async ngOnInit(): Promise<void> {
    await this.twoFactorAuthStore.onManage2fa();
  }

  otpForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  async verifyCode() {
    await this.twoFactorAuthStore.onVerify2fa(this.otpForm.controls.otp.value!);
  }
}
