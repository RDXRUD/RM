// import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { Observable, of } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(public jwtHelper: JwtHelperService) { }

//   public isAuthenticated(): boolean {
//     const token = localStorage.getItem('token');
//     return !this.jwtHelper.isTokenExpired(token);
//   }

//   public getToken(): any{
//     return localStorage.getItem('token');
//   }

//   public getUser(): any {
//     const token = this.getToken();
//     if (token) {
//       return this.jwtHelper.decodeToken(token);
//     } else {
//       return null;
//     }
//   }

//   public logout(): void {
//     localStorage.removeItem('token');
//   }
// }
