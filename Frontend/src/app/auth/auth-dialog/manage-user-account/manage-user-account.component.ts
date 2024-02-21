import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { ManageUserAccountStore } from './manage-user-account.store';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ErrorToMessagePipe } from '../error-to-message.pipe';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { passwordValidators } from '../password-validators';
import { Store } from '@ngrx/store';
import { selectUserAccount } from '../../auth.selectors';

@Component({
  selector: 'app-manage-user-account',
  standalone: true,
  imports: [
    MatButton,
    MatList,
    MatListItem,
    MatNavList,
    AsyncPipe,
    MatIcon,
    MatIconButton,
    MatProgressBar,
    ErrorToMessagePipe,
    FormsModule,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
  ],
  providers: [ManageUserAccountStore],
  templateUrl: './manage-user-account.component.html',
  styleUrl: './manage-user-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUserAccountComponent {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly manageStore = inject(ManageUserAccountStore);

  protected readonly credentialsForm = this.formBuilder.group({
    email: [
      this.store.selectSignal(selectUserAccount)()?.email,
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
      },
    ],
    password: [
      '',
      {
        validators: passwordValidators.slice(1),
        updateOn: 'change',
      },
    ],
  });
}
