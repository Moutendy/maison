import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http:HttpClient) { }

  public getSuppliers()
  {
    return this.http.get("http://localhost:8083/suppliers");
  }
}
