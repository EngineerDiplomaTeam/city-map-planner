import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { poiActions } from '../poi/poi.actions';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-poi-manage',
  standalone: true,
  imports: [MatListModule, MatIcon, MatIconButton],
  templateUrl: './poi-manage.component.html',
  styleUrl: './poi-manage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiManageComponent {
  protected readonly poiActions = poiActions;
}
