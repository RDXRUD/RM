// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { AuthService } from './auth.service';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//     constructor(private authService: AuthService, private router: Router) {}
  
//     canActivate(
//       next: ActivatedRouteSnapshot,
//       state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//       if (this.authService.isAuthenticated()) {
//         return true;
//       } else {
//         this.router.navigate(['Login']);
//         return false;
//       }
//     }
//   }
