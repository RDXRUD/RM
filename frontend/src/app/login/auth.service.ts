// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly TOKEN_KEY = 'auth_token';

//   constructor() { }

//   public login(username: string, password: string): boolean {
//     if (username === 'admin' && password === 'password') {
//       const token = 'dummy_jwt_token'; // Replace this with your actual JWT token
//       localStorage.setItem(this.TOKEN_KEY, token);
//       return true;
//     } else {
//       return false;
//     }
//   }

//   public logout(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//   }

//   public isAuthenticated(): boolean {
//     const token = localStorage.getItem(this.TOKEN_KEY);
//     return token !== null && token !== undefined;
//   }

//   public getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }
// }
