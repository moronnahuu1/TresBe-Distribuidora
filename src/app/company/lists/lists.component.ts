import { Component, inject, OnInit } from '@angular/core';
import { PublicUser } from 'src/app/models/PublicUser';
import { User } from 'src/app/models/User';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit{
  cookieService = inject(CookieService);
  user: PublicUser = new PublicUser('','','','',false,'');
  priceList: string = "";
  async ngOnInit() {
    (await this.cookieService.getUser()).subscribe(data => {
      this.user = data;
    });
    if(this.user.email != ""){
      this.priceList = this.user.priceList;
    }else{
      this.priceList = "4";
    }
  }
  downloadLink(brand: string){
    const link = document.createElement('a');
    link.href = `../../../assets/prices/${brand}${this.priceList}.pdf`;
    link.download = `Lista_Precios_${brand.toUpperCase()}.pdf`; // Especifica el nombre que deseas
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
