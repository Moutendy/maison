import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Keycloak from 'keycloak-js';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakSecurityService {
  private keycloakAuth: any;
  //une variable de recuperation les information de l'utilisateur
  static auth: any = {};
  init(): Promise<any> {
    return new Promise((resolve, reject) => {
     //configuration keycloak
      const config = {
        url: "http://localhost:8080/auth",
        realm: "ecom-realm",
        clientId: "AngularProductApp",
      };
      //l'utilisateur n'est pas loguer
      KeycloakSecurityService.auth.loggedIn = false;
      //on instancie la configuration
      this.keycloakAuth = Keycloak(config);
      //securiser le keycloak
      this.keycloakAuth
        .init({ onLoad: 'login-required' })
        .success(() => {
          //l'utilisateur est logué
          KeycloakSecurityService.auth.loggedIn = true;
          KeycloakSecurityService.auth.authz = this.keycloakAuth;
          KeycloakSecurityService.auth.logoutUrl =
            this.keycloakAuth.authServerUrl +
            '/realms/Appliance-realm' +
            '/protocol/openid-connect/logout?redirect_uri=' +
            //l'url localhost://4200
            document.baseURI;
          resolve(null);
        })
        .error(() => {
          reject();
        });
    });
  }
  //methode pour se déloguer
  static logout() {
    KeycloakSecurityService.auth.loggedIn = false;
    KeycloakSecurityService.auth.authz = null;

    window.location.href = KeycloakSecurityService.auth.logoutUrl;
  }
  //pour afficher le nom
  static getUsername(): string {
    return KeycloakSecurityService.auth.authz.tokenParsed.preferred_username;
  }
   //pour afficher le nom
  static getFullName(): string {
    return KeycloakSecurityService.auth.authz.tokenParsed.name;
  }
  //recupperer le token
  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (KeycloakSecurityService.auth.authz.token) {
        KeycloakSecurityService.auth.authz
          .updateToken(10)
          .success(() => {
            resolve(<string>KeycloakSecurityService.auth.authz.token);
          })
          .error(() => {
            KeycloakSecurityService.logout();
            reject('Failed to refresh token');
          });
      } else {
        KeycloakSecurityService.logout();
        reject('Not logged in');
      }
    });
  }

  isLoggedIn(): boolean {
    return KeycloakSecurityService.auth.authz.authenticated;
  }
//token refresh
  getUserToken() {
    const tokenPromise: Promise<string> = this.getToken();
    const tokenObservable: Observable<string> = from(tokenPromise);
    return tokenObservable;
  }
//retourner le role
  getRolesRealm() {
    if (KeycloakSecurityService.auth.authz.tokenParsed.realm_access !== undefined &&
      KeycloakSecurityService.auth.authz.tokenParsed.realm_access.roles !== undefined) {
      return KeycloakSecurityService.auth.authz.tokenParsed.realm_access.roles;
    }
  }

  //retourner les roles
  getRolesRessource(): [] {
    const resource_access: any = KeycloakSecurityService.auth.authz.tokenParsed.resource_access;
    const clientId = "AngularProductApp";
    if (resource_access !== undefined) {
      for (const [key, value] of Object.entries(resource_access)) {
        if (key === clientId) {
          const client: any = value;
          return client.roles as [];
        }
      }
    }
    return [];
  }
}
