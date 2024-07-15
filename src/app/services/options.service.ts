import { Injectable } from '@angular/core';
import { Options } from '../models/Options';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private myAppUrl: string;
  private myApiUrl: string;
  options: Options[] = [];
  _options: BehaviorSubject<Options[]> = new BehaviorSubject<Options[]>([]);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/options/'
  }
  async readProductOptions(productID: string){
    let featuresAux = await this.getProductOptionsTC(productID);
    if(featuresAux){
      this.options = featuresAux;
      this._options.next(this.options);
    }
    return this._options.asObservable();
  }
  async getProductOptionsTC(productID: string){
    try {
      const data = await this.getProductOptions(productID).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  deleteOneOption(featureID: string, index: number){
    this.deleteOption(featureID).subscribe(()=>{});
    this.options.splice(index, 1);
    this._options.next(this.options);
  }
  createOption(featureAux: Options){
    this.saveOptions(featureAux).subscribe(()=>{});
    this.options.unshift(featureAux);
    this._options.next(this.options);
  }
  updateOneOption(index: number, featureAux: Options){
    this.updateOptions(featureAux.id, featureAux).subscribe(()=>{});
    this.options[index] = featureAux;
    this._options.next(this.options);
  }
  getOptions(): Observable<Options[]> {
    return this.http.get<Options[]>(this.myAppUrl + this.myApiUrl); 
  }
  getOption(id: string): Observable<Options> {
    return this.http.get<Options>(this.myAppUrl + this.myApiUrl + id); 
  }
  getProductOptions(productID: string): Observable<Options[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'product/'
    return this.http.get<Options[]>(urlAux + productID); 
  }
  deleteOption(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteOptions(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveOptions(productAux: Options): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateOptions(id: string, productAux: Options): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
