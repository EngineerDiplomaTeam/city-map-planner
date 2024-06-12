import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { provideMockStore } from '@ngrx/store/testing';
import { WeatherIconsComponent } from './weather-icons/weather-icons.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [
        AppComponent,
        MockComponent(MatToolbar),
        MockComponent(MatIcon),
        MockDirective(MatToolbarRow),
        WeatherIconsComponent,
      ],
      providers: [provideMockStore()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
