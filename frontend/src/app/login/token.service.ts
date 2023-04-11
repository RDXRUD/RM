import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  public login(username: string, password: string): boolean {
    this.isLoggedIn.next(true);
    if (username === '' && password === '') {
      const token = 'dummy_jwt_token'; 
      localStorage.setItem(this.JWT_TOKEN, token);
      return true;
      
    } else {
      return false;
    }
  }
  public logout(): void {
    this.isLoggedIn.next(false);
    localStorage.removeItem(this.JWT_TOKEN);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);
    return token !== null && token !== undefined;
  }
  constructor(public jwtHelper: JwtHelperService) { }
  getToken(): string | null {
    this.isLoggedIn.next(true);
    return localStorage.getItem(this.JWT_TOKEN);
  }
  setToken(token:string) {
    localStorage.setItem(this.JWT_TOKEN, token);
    this.isLoggedIn.next(true);
  }
  removeToken() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isLoggedIn.next(false);
  }
  isTokenExpired(): boolean {
    this.isLoggedIn.next(false);
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token):true;
  }
}


