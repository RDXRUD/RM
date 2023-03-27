import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  constructor(private jwtHelper: JwtHelperService) { }
  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  setToken(token:string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
  removeToken() {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }
}

