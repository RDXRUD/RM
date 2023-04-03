import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  public login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'password') {
      const token = 'dummy_jwt_token'; // Replace this with your actual JWT token
      localStorage.setItem(this.JWT_TOKEN, token);
      return true;
    } else {
      return false;
    }
  }
  public logout(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN);
    return token !== null && token !== undefined;
  }


  constructor(public jwtHelper: JwtHelperService) { }
  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  setToken(token:string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
  // removeToken() {
  //   localStorage.removeItem(this.JWT_TOKEN);
  // }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }
}

