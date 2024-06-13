import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./poi/poi-selector/poi-selector.component').then(
        (m) => m.PoiSelectorComponent,
      ),
  },
  {
    path: 'summary',
    loadComponent: () =>
      import('./poi/poi-summary/poi-summary.component').then(
        (m) => m.PoiSummaryComponent,
      ),
  },
  {
    path: 'poi-schedule',
    loadComponent: () =>
      import('./poi/poi-schedule/poi-schedule.component').then(
        (m) => m.PoiScheduleComponent,
      ),
  },
  {
    path: 'poi-manage',
    loadComponent: () =>
      import('./poi-manage/poi-manage.component').then(
        (m) => m.PoiManageComponent,
      ),
  },
  {
    path: 'weather',
    loadChildren: () =>
      import('./weather/weather.module').then((m) => m.WeatherModule),
  },
  {
    path: 'poi-list',
    loadComponent: () =>
      import('./poi-list/poi-list.component').then((m) => m.PoiListComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
