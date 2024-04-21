import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import {
  MatFabButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { PoiManageStore } from './poi-manage.store';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FindImageWithIconPipe } from './find-image-with-icon.pipe';
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuTrigger,
} from '@angular/material/menu';

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
  ],
  templateUrl: './poi-manage.component.html',
  styleUrl: './poi-manage.component.scss',
  providers: [PoiManageStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiManageComponent {
  protected readonly poiManageStore = inject(PoiManageStore);
}
