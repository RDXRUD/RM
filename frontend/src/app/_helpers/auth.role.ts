import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../_services/token.service'; // Replace with the actual service for accessing user roles
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.tokenService.isAuthenticated()) {

      const userRoles: string | null = this.tokenService.getRole();
      if (userRoles && userRoles.includes('Non-Admin')) {
        this.router.navigate(['/access-denied']);
        return false;
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}