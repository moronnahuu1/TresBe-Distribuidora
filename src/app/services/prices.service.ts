import { Injectable } from '@angular/core';
import { PriceXproduct } from '../models/PriceXproduct';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  private myAppUrl: string;
  private myApiUrl: string;
  prices: PriceXproduct = new PriceXproduct('','',0,0,0,0,0,0,0);
  _prices: BehaviorSubject<PriceXproduct> = new BehaviorSubject<PriceXproduct>(this.prices);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/tablePrice/'
  }

  returnPrices(){
    return this._prices.asObservable();
  }

  async readTableByProduct(optionID: string){
    let tablesAux = await this.getTableProductTC(optionID);
    if(tablesAux){
      this.prices = tablesAux;
      this._prices.next(this.prices);
    }
    return this._prices.asObservable();
  }

  async getTableProductTC(optionID: string){
    try {
      const data = await this.getTableByProduct(optionID).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  getProducts(): Observable<PriceXproduct[]> {
    return this.http.get<PriceXproduct[]>(this.myAppUrl + this.myApiUrl); 
  }
  getProduct(id: string): Observable<PriceXproduct> {
    return this.http.get<PriceXproduct>(this.myAppUrl + this.myApiUrl + id); 
  }
  getTableByProduct(optionID: string): Observable<PriceXproduct> {
    let urlAux = this.myAppUrl + this.myApiUrl + "product/";
    return this.http.get<PriceXproduct>(urlAux + optionID);
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
