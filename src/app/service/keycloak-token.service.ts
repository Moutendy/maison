import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Keycloak from 'keycloak-js';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakSecurityService {
  private keycloakAuth: any;
  static auth: any = {};
  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const config = {
        url: "http://localhost:8080/auth",
        realm: "Appliance-realm",
        clientId: "Pov",
      };
      KeycloakSecurityService.auth.loggedIn = false;
      this.keycloakAuth = Keycloak(config);
      this.keycloakAuth
        .init({ onLoad: 'login-required' })
        .success(() => {
          KeycloakSecurityService.auth.loggedIn = true;
          KeycloakSecurityService.auth.authz = this.keycloakAuth;
          KeycloakSecurityService.auth.logoutUrl =
            this.keycloakAuth.authServerUrl +
            '/realms/Appliance-realm' +
            '/protocol/openid-connect/logout?redirect_uri=' +
            document.baseURI;
          resolve();
        })
        .error(() => {
          reject();
        });
    });
  }
  static logout() {
    KeycloakSecurityService.auth.loggedIn = false;
    KeycloakSecurityService.auth.authz = null;

    window.location.href = KeycloakSecurityService.auth.logoutUrl;
  }
  static getUsername(): string {
    return KeycloakSecurityService.auth.authz.tokenParsed.preferred_username;
  }
  static getFullName(): string {
    return KeycloakSecurityService.auth.authz.tokenParsed.name;
  }
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

  getUserToken() {
    const tokenPromise: Promise<string> = this.getToken();
    const tokenObservable: Observable<string> = from(tokenPromise);
    return tokenObservable;
  }

  getRolesRealm(): [] {
    if (KeycloakSecurityService.auth.authz.tokenParsed.realm_access !== undefined &&
      KeycloakSecurityService.auth.authz.tokenParsed.realm_access.roles !== undefined) {
      return KeycloakSecurityService.auth.authz.tokenParsed.realm_access.roles;
    }
  }

  getRolesRessource(): [] {
    const resource_access: any = KeycloakSecurityService.auth.authz.tokenParsed.resource_access;
    const clientId = "Pov";
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
