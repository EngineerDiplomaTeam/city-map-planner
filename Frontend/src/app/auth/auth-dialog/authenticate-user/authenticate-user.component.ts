import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ErrorToMessagePipe } from '../error-to-message.pipe';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthenticateUserStore } from './authenticate-user.store';
import { MatProgressBar } from '@angular/material/progress-bar';
import { passwordValidators } from '../password-validators';

@Component({
  selector: 'app-authenticate-user',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatHint,
    MatSuffix,
    ReactiveFormsModule,
    JsonPipe,
    MatError,
    ErrorToMessagePipe,
    MatProgressSpinner,
    AsyncPipe,
    MatProgressBar,
  ],
  providers: [AuthenticateUserStore],
  templateUrl: './authenticate-user.component.html',
  styleUrl: './authenticate-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticateUserComponent {
  protected readonly authStore = inject(AuthenticateUserStore);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly credentialsForm = this.formBuilder.group({
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
      },
    ],
    password: [
      '',
      {
        validators: passwordValidators,
        updateOn: 'change',
      },
    ],
  });

  protected readonly forgotPasswordForm = this.formBuilder.group({
    resetCode: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    password: [
      '',
      {
        validators: passwordValidators,
        updateOn: 'change',
      },
    ],
  });

  protected readonly emailSentText = computed(() => {
    if (this.authStore.activationEmailSentCount() === 0) return '';
    if (this.authStore.activationEmailSentCount() === 1) return 'Email sent.';
    return `Email sent ${this.authStore.activationEmailSentCount()} times.`;
  });
}
