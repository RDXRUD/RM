import { Component } from '@angular/core';
import { TokenService } from './_services/token.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent {
  Roles:any;
  title = 'TeamTracker';
  isLoggedIn: boolean = false;
  showSessionExpiredMessage = false;
  localStorage: any;
 
  constructor(public tokenService: TokenService, private router: Router) {
    this.tokenService.isLoggedIn.subscribe((loggedIn) => {
      this.Roles=localStorage.getItem("Role")
      console.log('Rolesthis:', this.Roles);
      this.isLoggedIn = this.tokenService.isAuthenticated();
      
    })
  }

  ngOnInit(): void {
  }
  
  OnLogout() {
    this.tokenService.removeToken();
    this.router.navigate(['/Login']);
  }
}
