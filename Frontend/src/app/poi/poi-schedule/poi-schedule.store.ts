import { ComponentStore } from '@ngrx/component-store';
import { EventInput } from '@fullcalendar/core';
import { effect, inject, Injectable } from '@angular/core';
import { ResourceInput } from '@fullcalendar/resource';
import { Store } from '@ngrx/store';
import { selectAllPois } from '../poi.selectors';
import { PointOfInterest } from '../poi.reducer';

interface PoiScheduleState {
  events: EventInput[];
  resources: ResourceInput[];
  unassigned: PointOfInterest[];
}

@Injectable({
  providedIn: 'root',
})
export class PoiScheduleStore extends ComponentStore<PoiScheduleState> {
  private readonly store = inject(Store);
  protected readonly poisInBasket = this.store.selectSignal(selectAllPois);
  public readonly events = this.selectSignal((x) => x.events);
  public readonly resources = this.selectSignal((x) => x.resources);
  public readonly unassigned = this.selectSignal((x) => x.unassigned);

  protected readonly addInitialUnassignedPoisEffect = effect(
    () => {
      const pois = structuredClone(this.poisInBasket());
      this.patchState(() => ({ unassigned: pois }));
    },
    { allowSignalWrites: true },
  );

  constructor() {
    super({
      unassigned: [],
      events: [
        {
          resourceId: 'day-1',
          groupId: 'availableForMeeting',
          start: '2024-05-05T10:00:00',
          end: '2024-05-05T18:00:00',
          display: 'background',
        },
      ],
      resources: [
        {
          id: 'day-1',
          title: '12.12.2024',
          businessHours: [
            {
              startTime: '11:00',
              endTime: '17:00',
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7],
            },
          ],
        },
        {
          id: 'day-3',
          title: '14.12.2024',
          businessHours: [
            {
              startTime: '08:00',
              endTime: '10:00',
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7],
            },
            {
              startTime: '14:00',
              endTime: '18:00',
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7],
            },
          ],
        },
      ],
    });
  }
}
