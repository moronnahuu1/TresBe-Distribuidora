import { Injectable } from '@angular/core';
import { Feature } from '../models/Feature';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Features/'
  }
  getFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.myAppUrl + this.myApiUrl); 
  }
  getFeature(id: string): Observable<Feature> {
    return this.http.get<Feature>(this.myAppUrl + this.myApiUrl + id); 
  }
  deleteFeature(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteFeatures(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveFeature(productAux: Feature): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateFeature(id: string, productAux: Feature): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
