import { Component } from '@angular/core';
import { TokenService } from './_services/token.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TeamTracker';
  isLoggedIn: boolean = false;
  showSessionExpiredMessage = false;
  constructor(public tokenService: TokenService, private router: Router) {
    this.tokenService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit(): void {
  }
  
  OnLogout() {
    this.tokenService.removeToken();
    this.router.navigate(['/Login'])
  }
}
