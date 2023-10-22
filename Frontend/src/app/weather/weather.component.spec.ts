import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherComponent } from './weather.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatList } from '@angular/material/list';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WeatherComponent,
        MockComponent(MatCard),
        MockComponent(MatCardHeader),
        MockComponent(MatList),
        MockDirective(MatCardActions),
        MockDirective(MatCardContent),
        MockDirective(MatCardTitle),
      ],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
