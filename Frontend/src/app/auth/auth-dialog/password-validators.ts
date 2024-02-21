import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export const atLeastOneDigit: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors =>
  /\d/.test(control.value) || !control.value ? {} : { atLeastOneDigit: true };

export const atLeastOneUppercase: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors =>
  /[A-Z]/.test(control.value) || !control.value
    ? {}
    : { atLeastOneUppercase: true };

export const atLeastOneNonAlphanumeric: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors =>
  /[^A-Za-z0-9]/.test(control.value) || !control.value
    ? {}
    : { atLeastOneNonAlphanumeric: true };

export const passwordValidators = [
  Validators.required,
  Validators.min(6),
  atLeastOneDigit,
  atLeastOneUppercase,
  atLeastOneNonAlphanumeric,
];
