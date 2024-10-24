import { Injectable } from '@angular/core';
import { PriceXproduct } from '../models/PriceXproduct';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  private myAppUrl: string;
  private myApiUrl: string;
  prices: PriceXproduct = new PriceXproduct('', '', 0, 0, 0, 0, 0, 0, 0);
  _prices: BehaviorSubject<PriceXproduct> = new BehaviorSubject<PriceXproduct>(this.prices);
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/tablePrice/'
  }

  returnPrices() {
    return this._prices.asObservable();
  }

  async readTableByProduct(optionID: string) {
    let tablesAux = await this.getTableProductTC(optionID);
    if (tablesAux) {
      this.prices = tablesAux;
      this._prices.next(this.prices);
    }
    return this._prices.asObservable();
  }

  async getTableProductTC(optionID: string) {
    try {
      const data = await this.getTableByProduct(optionID).toPromise();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error obteniendo datos:', error.message);
      }
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  getProducts(): Observable<PriceXproduct[]> {
    return this.http.get<PriceXproduct[]>(this.myAppUrl + this.myApiUrl, { withCredentials: true });
  }
  getProduct(id: string): Observable<PriceXproduct> {
    return this.http.get<PriceXproduct>(this.myAppUrl + this.myApiUrl + id);
  }
  getTableByProduct(optionID: string): Observable<PriceXproduct> {
    let urlAux = this.myAppUrl + this.myApiUrl + "product/";
    return this.http.get<PriceXproduct>(urlAux + optionID);
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, { withCredentials: true });
  }
  deleteProducts(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`, { withCredentials: true });
  }
  saveProduct(productAux: PriceXproduct): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux, { withCredentials: true });
  }
  updateProduct(id: string, productAux: PriceXproduct): Observable<void> {
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
  async updateOptionID(oldOptionID: string, optionID: string) {
    let urlAux = this.myAppUrl + this.myApiUrl + 'update/option/'
    let option = {
      optionID
    }
    return this.http.patch<void>(urlAux + oldOptionID, option,{
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
  });
  }
}
