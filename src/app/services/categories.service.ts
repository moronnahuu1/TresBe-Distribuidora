import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private myAppUrl: string;
  private myApiUrl: string;
  categories: Category[] = [];
  categorySelected: string = ''
  _categorySelected: BehaviorSubject<string> = new BehaviorSubject<string>(this.categorySelected);
  _categories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(this.categories);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Categories/'
  }
  changeSelected(category: string){
    this.categorySelected = category;
    this._categorySelected.next(this.categorySelected);
  }
  returnSelected(){
    return this._categorySelected.asObservable();
  }
  returnCategories(){
    return this._categories.asObservable();
  }
  async readCategories(){
    let categoriesAux = await this.getCategoriesTC();
    if(categoriesAux){
      this.categories = categoriesAux;
      this._categories.next(this.categories);
    }
    return this._categories.asObservable();
  }
  async getCategoriesTC(){
    try{
      const data = await this.getCategories().toPromise();
      console.log(data);
      return data;
    }catch(error){
      console.log(error);
      throw error;
    }
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.myAppUrl + this.myApiUrl); 
  }
  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(this.myAppUrl + this.myApiUrl + id); 
  }
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteCategories(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveCategory(categoryAux: Category): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, categoryAux);
  }
  updateCategory(id: string, productAux: Category): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
