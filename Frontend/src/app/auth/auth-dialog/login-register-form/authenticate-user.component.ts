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
import { ErrorToMessagePipe } from './error-to-message.pipe';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthenticateStore } from './authenticate.store';
import { MatProgressBar } from '@angular/material/progress-bar';

const atLeastOneDigit: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors =>
  /\d/.test(control.value) ? {} : { atLeastOneDigit: true };

const atLeastOneUppercase: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors =>
  /[A-Z]/.test(control.value) ? {} : { atLeastOneUppercase: true };

const atLeastOneNonAlphanumeric: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors =>
  /[^A-Za-z0-9]/.test(control.value) ? {} : { atLeastOneNonAlphanumeric: true };

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
  providers: [AuthenticateStore],
  templateUrl: './authenticate-user.component.html',
  styleUrl: './authenticate-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticateUserComponent {
  protected readonly authStore = inject(AuthenticateStore);
  protected readonly formBuilder = inject(FormBuilder);
  private readonly passwordValidators = [
    Validators.required,
    Validators.min(6),
    atLeastOneDigit,
    atLeastOneUppercase,
    atLeastOneNonAlphanumeric,
  ];
  protected readonly credentialsForm = this.formBuilder.group({
    email: [
      'electroluxv2@gmail.com',
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
      },
    ],
    password: [
      'Mb@20529',
      {
        validators: this.passwordValidators,
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
      'Mb@20529',
      {
        validators: this.passwordValidators,
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
