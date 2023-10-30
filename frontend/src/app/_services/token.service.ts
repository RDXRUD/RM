import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  getRole():string|null{
    this.isLoggedIn.next(true);
    return localStorage.getItem("Role");
  }
  getUserID():string|null{
    this.isLoggedIn.next(true);
    return localStorage.getItem("UserID");
  }
  getToken(): string | null {
    this.isLoggedIn.next(true);
    return localStorage.getItem(this.JWT_TOKEN);
  }
  setDetails(token: string,role:string,userId:string) {
    localStorage.setItem(this.JWT_TOKEN, token);
    localStorage.setItem("Role", role);
    localStorage.setItem("UserID", userId);
    this.isLoggedIn.next(true);
  }
  removeToken() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem("UserID");
    localStorage.removeItem("Role");
    this.isLoggedIn.next(false);
  }
}