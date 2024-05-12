import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import {
  MatFabButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { PoiManageStore } from './poi-manage.store';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FindImageWithIconPipe } from './find-image-with-icon.pipe';
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuTrigger,
} from '@angular/material/menu';
import { RequireUpdatePipe } from './require-update.pipe';
import { MatBadge } from '@angular/material/badge';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-poi-manage',
  standalone: true,
  imports: [
    MatListModule,
    MatIcon,
    MatIconButton,
    JsonPipe,
    AsyncPipe,
    MatProgressBar,
    FindImageWithIconPipe,
    MatFabButton,
    MatMiniFabButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatMenuContent,
    DatePipe,
    RequireUpdatePipe,
    MatBadge,
    MatTooltip,
  ],
  templateUrl: './poi-manage.component.html',
  styleUrl: './poi-manage.component.scss',
  providers: [PoiManageStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiManageComponent {
  protected readonly poiManageStore = inject(PoiManageStore);
}
