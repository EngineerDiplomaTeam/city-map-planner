import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PointOfInterest } from './poi.reducer';

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  private readonly http = inject(HttpClient);

  public listPois(): Observable<PointOfInterest[]> {
    return this.http.get<PointOfInterest[]>('/Api/Poi');
  }
}
