import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { PoiManageStore } from '../poi-manage.store';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ManageablePoi, ManageablePoiBusinessTime } from '../poi-manage.model';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

export interface AddOrEditPoiDialogData {
  poiManageStore: PoiManageStore;
  poi: ManageablePoi;
}

const WMO_CODES = [
  {
    code: 0,
    text: 'Clear sky',
  },
  {
    code: 1,
    text: 'Mainly clear',
  },
  {
    code: 2,
    text: 'Partly cloudy',
  },
  {
    code: 3,
    text: 'Overcast',
  },
  {
    code: 45,
    text: 'Fog',
  },
  {
    code: 48,
    text: 'Depositing rime Fog',
  },
  {
    code: 51,
    text: 'Light drizzle',
  },
  {
    code: 53,
    text: 'Moderate drizzle',
  },
  {
    code: 55,
    text: 'Dense drizzle',
  },
  {
    code: 56,
    text: 'Light freezing drizzle',
  },
  {
    code: 57,
    text: 'Dense freezing drizzle',
  },
  {
    code: 61,
    text: 'Slight rain',
  },
  {
    code: 63,
    text: 'Moderate rain',
  },
  {
    code: 65,
    text: 'Heavy rain',
  },
  {
    code: 66,
    text: 'Light freezing rain',
  },
  {
    code: 67,
    text: 'Heavy freezing rain',
  },
  {
    code: 71,
    text: 'Slight snow fall',
  },
  {
    code: 73,
    text: 'Moderate snow fall',
  },
  {
    code: 75,
    text: 'Heavy snow fall',
  },
  {
    code: 77,
    text: 'Snow grains',
  },
  {
    code: 80,
    text: 'Slight rain showers',
  },
  {
    code: 81,
    text: 'Moderate rain showers',
  },
  {
    code: 82,
    text: 'Violent rain showers',
  },
  {
    code: 85,
    text: 'Slight snow showers',
  },
  {
    code: 86,
    text: 'Heavy snow showers',
  },
  {
    code: 95,
    text: 'Thunderstorm',
  },
  {
    code: 96,
    text: 'Thunderstorm with light hail',
  },
  {
    code: 99,
    text: 'Thunderstorm with heavy hail',
  },
];

@Component({
  selector: 'app-add-or-edit-poi-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDivider,
    MatDatepickerModule,
    MatSelectModule,
    MatMenu,
    MatMenuItem,
    MatProgressSpinner,
  ],
  templateUrl: './add-or-edit-poi-dialog.component.html',
  styleUrl: './add-or-edit-poi-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOrEditPoiDialogComponent {
  protected readonly httpClient = inject(HttpClient);
  protected readonly data = inject<AddOrEditPoiDialogData>(DIALOG_DATA);
  protected readonly poi = this.data.poi;
  protected readonly aiThinking = signal(false);

  public addEntrance(): void {
    this.poi.entrances.push({
      description: '',
      name: '',
      osmNodeId: 0,
    });
  }

  public removeEntrance(index: number): void {
    this.poi.entrances.splice(index, 1);
  }

  public addImage(): void {
    this.poi.images.push({
      attribution: '',
      fullSrc: '',
      iconSrc: '',
    });
  }

  public removeImage(index: number): void {
    this.poi.images.splice(index, 1);
  }

  public addBusinessTime(): void {
    this.poi.businessTimes.push({
      effectiveDays: [],
      effectiveFrom: '',
      effectiveTo: '',
      state: 0,
      timeFrom: '',
      timeTo: '',
    });
  }

  public removeBusinessTime(index: number): void {
    this.poi.businessTimes.splice(index, 1);
  }

  protected readonly WMO_CODES = WMO_CODES;

  protected async addBusinessTimeWithAi(): Promise<void> {
    if (this.aiThinking()) return;

    this.aiThinking.set(true);
    this.poi.businessTimes = [];

    try {
      this.poi.businessTimes = await firstValueFrom(
        this.httpClient.get<ManageablePoiBusinessTime[]>(
          `/Api/PoiManage/${this.poi.id}/Ai`,
        ),
      );
    } catch (e) {
      this.data.poiManageStore.handleError(e);
    } finally {
      this.aiThinking.set(false);
    }
  }
}
