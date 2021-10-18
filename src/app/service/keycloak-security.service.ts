import { Injectable } from '@angular/core';
import {KeycloakInstance} from "keycloak-js";
import {HttpClient,HttpHeaders} from "@angular/common/http";
declare var Keycloak:any;
@Injectable({providedIn: "root"})

export class KeycloakSecurityService {
 public kc:KeycloakInstance|any

  constructor(private http:HttpClient) { }
  async init()
  {
    console.log("securité !!");

    this.kc=new Keycloak({
      url :"http://localhost:8080/auth",
      realm :"ecom-realm",
      clientId :"AngularProductApp"
    });
    await this.kc.init({
      onload:'login-required',
      promiseType:'native'
    });
    console.log(this.kc.token);




  }
}
