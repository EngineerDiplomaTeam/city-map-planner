import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-manage-user-account',
  standalone: true,
  imports: [MatButton],
  templateUrl: './manage-user-account.component.html',
  styleUrl: './manage-user-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUserAccountComponent {}
