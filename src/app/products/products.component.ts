import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any;
  constructor() { }

  ngOnInit(): void {
    this.products=[{id:1,name:"HP",prix:4567}
    ,{id:2,name:"SONI",prix:5567},{id:3,name:"Blackberry",prix:7587}]
  }

}
