import { Component } from '@angular/core';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent {
  city: string = "Mar Del Plata";
  province: string = "Buenos Aires";
  Country: string = "Argentina";
}
