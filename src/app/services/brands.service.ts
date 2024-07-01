import { Injectable } from '@angular/core';
import { Brand } from '../models/Brand';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/brands/'
  }
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.myAppUrl + this.myApiUrl); 
  }
  getBrand(id: string): Observable<Brand> {
    return this.http.get<Brand>(this.myAppUrl + this.myApiUrl + id); 
  }
  deleteBrand(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteBrands(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveBrand(productAux: Brand): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateBrand(id: string, productAux: Brand): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
