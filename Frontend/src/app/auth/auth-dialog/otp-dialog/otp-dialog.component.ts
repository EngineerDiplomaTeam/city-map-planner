import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogActions,
    MatButton,
    ReactiveFormsModule,
    MatDialogClose,
  ],
  templateUrl: './otp-dialog.component.html',
  styleUrl: './otp-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpDialogComponent {
  otpInput = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ]);
}
