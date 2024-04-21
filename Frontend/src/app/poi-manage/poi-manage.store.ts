import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { ManageablePoi } from './poi-manage.model';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {
  AddOrEditPoiDialogComponent,
  AddOrEditPoiDialogData,
} from './add-or-edit-poi-dialog/add-or-edit-poi-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export interface PoiManageState {
  loading: boolean;
  manageablePois: ManageablePoi[];
}

@Injectable()
export class PoiManageStore extends ComponentStore<PoiManageState> {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly httpClient = inject(HttpClient);
  public readonly loading = this.selectSignal((state) => state.loading);
  public readonly manageablePois = this.selectSignal(
    (state) => state.manageablePois,
  );

  constructor() {
    super({
      loading: false,
      manageablePois: [],
    });

    void this.loadAllManageablePois();
  }

  public async onDeletePoiClick(id: ManageablePoi['id']): Promise<void> {
    const ref = this.dialog.open(ConfirmDialogComponent);
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;

    try {
      await firstValueFrom(this.httpClient.delete(`/Api/PoiManage/${id}`));
      this.patchState((state) => ({
        manageablePois: state.manageablePois.filter((x) => x.id !== id),
      }));
    } catch (e) {
      this.handleError(e);
    }
  }

  public async onAddPoiClick(): Promise<void> {
    await this.openEditorModal({
      name: '',
      description: '',
      entrances: [],
      images: [],
      preferredWmoCodes: [],
      preferredSightseeingTime: '',
      businessTimes: [],
    });
  }

  public async onEditPoiClick(id: ManageablePoi['id']): Promise<void> {
    await this.openEditorModal(this.manageablePois().find((x) => x.id === id)!);
  }

  private async postPoi(poi: ManageablePoi): Promise<void> {
    this.patchState(() => ({
      loading: true,
    }));

    try {
      const payload = Object.assign({}, poi, {
        businessTimes: poi.businessTimes.map((x) => ({
          ...x,
          state: Number(x.state),
        })),
      });

      const patched = await firstValueFrom(
        this.httpClient.post<ManageablePoi>('/Api/PoiManage', payload),
      );

      const existingIndex = this.manageablePois().findIndex(
        (x) => x.id === patched.id,
      );

      if (existingIndex >= 0) {
        const newPois = this.manageablePois();
        newPois[existingIndex] = patched;
        this.patchState(() => ({
          manageablePois: newPois,
        }));
      } else {
        this.patchState((state) => ({
          manageablePois: state.manageablePois.concat(patched),
        }));
      }
    } catch (e) {
      void this.openEditorModal(poi);
      this.handleError(e);
    } finally {
      this.patchState(() => ({
        loading: false,
      }));
    }
  }

  private async loadAllManageablePois(): Promise<void> {
    this.patchState(() => ({
      loading: true,
    }));

    try {
      const pois = await firstValueFrom(
        this.httpClient.get<ManageablePoi[]>('/Api/PoiManage'),
      );

      this.patchState(() => ({
        loading: false,
        manageablePois: pois,
      }));
    } catch (e) {
      this.openErrorSnackBar('An error occurred while loading all pois');
      console.error(e, 'An error occurred while loading all pois');
      this.patchState(() => ({
        loading: false,
        manageablePois: [],
      }));
    }
  }

  private openErrorSnackBar(message: string): MatSnackBarRef<unknown> {
    return this.snackBar.open(message, 'close', {
      panelClass: 'error-snackbar',
    });
  }

  private handleError(e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'error' in e &&
      e.error &&
      typeof e.error === 'object' &&
      'errors' in e.error &&
      e.error.errors &&
      typeof e.error.errors === 'object'
    ) {
      const fieldErrors = Object.entries(e.error.errors).map(
        ([key, value]) => `${key}: ${value.join(', ')}\n`,
      );

      const message = ['Following errors occured:', fieldErrors.join('\n')];

      this.openErrorSnackBar(message.join('\n'));
    } else {
      this.openErrorSnackBar('An error occurred');
    }

    console.error(e, 'An error occurred');
  }

  private async openEditorModal(poi: ManageablePoi): Promise<void> {
    const ref = this.dialog.open<
      AddOrEditPoiDialogComponent,
      AddOrEditPoiDialogData
    >(AddOrEditPoiDialogComponent, {
      width: '90svw',
      disableClose: true,
      data: {
        poiManageStore: this,
        poi,
      },
    });

    const result = await firstValueFrom(ref.afterClosed());
    if (!result) return;
    await this.postPoi(result);
  }
}
