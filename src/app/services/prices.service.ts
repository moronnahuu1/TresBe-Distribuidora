import { Injectable } from '@angular/core';
import { PriceXproduct } from '../models/PriceXproduct';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/tablePrice/'
  }
  getProducts(): Observable<PriceXproduct[]> {
    return this.http.get<PriceXproduct[]>(this.myAppUrl + this.myApiUrl); 
  }
  getProduct(id: string): Observable<PriceXproduct> {
    return this.http.get<PriceXproduct>(this.myAppUrl + this.myApiUrl + id); 
  }
  getTableByProduct(productID: string): Observable<PriceXproduct> {
    let urlAux = this.myAppUrl + this.myApiUrl + "product/";
    return this.http.get<PriceXproduct>(urlAux + productID);
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteProducts(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveProduct(productAux: PriceXproduct): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateProduct(id: string, productAux: PriceXproduct): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
