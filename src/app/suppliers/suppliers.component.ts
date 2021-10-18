import { Component, OnInit } from '@angular/core';
import {SuppliersService} from "../service/suppliers.service";

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  constructor(private services:SuppliersService) { }
   public suppliers:any
  ngOnInit(): void
  {
    this.supplier();
    console.log("les resultats "+this.suppliers)
  }
public supplier()
{
  this.services.getSuppliers().subscribe(data=>{this.suppliers=data;
    console.log("les resultats"+this.suppliers)},
      error => {
    console.log(error)
  });
}
}
