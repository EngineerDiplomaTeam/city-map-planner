import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AUTH_FEATURE_KEY, authReducer } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { tokenInterceptor } from './auth/token.interceptor';
import { POI_FEATURE_KEY, poiReducer } from './poi/poi.reducer';
import { PoiEffects } from './poi/poi.effects';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [AppComponent, WeatherComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    StoreModule.forRoot({
      [AUTH_FEATURE_KEY]: authReducer,
      [POI_FEATURE_KEY]: poiReducer,
    }),
    EffectsModule.forRoot([AuthEffects, PoiEffects]),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
