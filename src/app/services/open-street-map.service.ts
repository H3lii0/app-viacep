import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {
  apiUrl = 'https://nominatim.openstreetmap.org/search?q=';
  constructor(
    private http: HttpClient
  ) { }

  getGeoLocation(queryParams: string) {
    return this.http.get(`${this.apiUrl}${queryParams}&format=json&addressdetails=1&limit=5`);
  }
}
