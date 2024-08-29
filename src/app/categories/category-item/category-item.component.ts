import { Component, OnInit, inject } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent implements OnInit{
  categoryService = inject(CategoriesService);
  categories: Array<Category> = [];
  async ngOnInit(): Promise<void> {
      await this.readCategories();
  }
  selectCategory(name: string){
    this.categoryService.changeSelected(name);
  }
  async readCategories(): Promise<void> {
    const categoriesAux = await this.getCategories();
    if(categoriesAux != undefined){
      for(let i=0; i<categoriesAux.length; i++){
        this.categories.push(categoriesAux[i]);
      }
    }
}
  async getCategories(): Promise<Category[] | undefined>{
    try {
      const data = await this.categoryService.getCategories().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
}
