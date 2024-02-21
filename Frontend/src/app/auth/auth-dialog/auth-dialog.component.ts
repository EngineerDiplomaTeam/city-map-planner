import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { selectUserAccount } from '../auth.selectors';
import { AsyncPipe } from '@angular/common';
import { AuthenticateUserComponent } from './authenticate-user/authenticate-user.component';
import { ManageUserAccountComponent } from './manage-user-account/manage-user-account.component';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatHint,
    AsyncPipe,
    AuthenticateUserComponent,
    MatIconButton,
    AuthenticateUserComponent,
    ManageUserAccountComponent,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
  private readonly store = inject(Store);
  protected readonly userAccount$ = this.store.select(selectUserAccount);
}
