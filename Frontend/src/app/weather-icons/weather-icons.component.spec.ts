import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherIconsComponent } from './weather-icons.component';
import { HttpClientModule } from '@angular/common/http';

describe('WeatherIconsComponent', () => {
  let component: WeatherIconsComponent;
  let fixture: ComponentFixture<WeatherIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherIconsComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
