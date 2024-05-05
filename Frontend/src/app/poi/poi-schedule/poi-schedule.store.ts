import { ComponentStore } from '@ngrx/component-store';
import { EventInput } from '@fullcalendar/core';
import { ChangeDetectorRef, effect, inject, Injectable } from '@angular/core';
import { ResourceInput } from '@fullcalendar/resource';
import { EventData } from '@angular/cdk/testing';
import { Store } from '@ngrx/store';
import { selectAllPois } from '../poi.selectors';
import { PointOfInterest } from '../poi.reducer';

interface PoiScheduleState {
  events: EventInput[];
  resources: ResourceInput[];
  unassigned: PointOfInterest[];
}

@Injectable()
export class PoiScheduleStore extends ComponentStore<PoiScheduleState> {
  private readonly store = inject(Store);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly poisInBasket = this.store.selectSignal(selectAllPois);
  public readonly events = this.selectSignal((x) => x.events);
  public readonly resources = this.selectSignal((x) => x.resources);
  public readonly unassigned = this.selectSignal((x) => x.unassigned);

  protected readonly addInitialUnassignedPoisEffect = effect(
    () => {
      // TODO: Filter out these that are assigned
      const inBasket = this.poisInBasket();
      const pois = structuredClone(inBasket);

      this.patchState(() => ({ unassigned: pois }));
      this.cdr.detectChanges();
    },
    { allowSignalWrites: true },
  );

  constructor() {
    super({
      unassigned: [],
      events: [],
      resources: [
        {
          id: 'day-1',
          title: '12.12.2024',
        },
        {
          id: 'day-3',
          title: '14.12.2024',
        },
        {
          id: 'day-4',
          title: '15.12.2024',
        },
        {
          id: 'day-5',
          title: '16.12.2024',
        },
        {
          id: 'day-6',
          title: '19.12.2024',
        },
        {
          id: 'day-7',
          title: '22.12.2024',
        },
      ],
    });
  }
}
