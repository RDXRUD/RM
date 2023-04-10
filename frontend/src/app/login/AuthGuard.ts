import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private token_service: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (!this.token_service.isAuthenticated()) {
    
      this.router.navigate(['/Login']);
    } 
      return true;
      
    }
   
  }

