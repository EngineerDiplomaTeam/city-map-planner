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
    path: 'weather',
    loadChildren: () =>
      import('./weather/weather.module').then((m) => m.WeatherModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
