import { Component } from '@angular/core';
import { TokenService } from './_services/token.service';
import { Router } from '@angular/router';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './sso.config';
import { SpinnerService } from './_services/spinner.service';


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
  loading: boolean = false;
 
  constructor(
    private spinnerService:SpinnerService,
    private oauthService:OAuthService,
    public tokenService: TokenService, 
    private router: Router) 
    {
    this.tokenService.isLoggedIn.subscribe(() => {
      this.Roles=localStorage.getItem("Role")
      this.isLoggedIn = this.tokenService.isAuthenticated();
      
    }),
    this.configureSingleSignOn()
  }
  ngOnInit() {

  }

  configureSingleSignOn(){
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler=new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();

  }


  OnLogout() {
    this.oauthService.revokeTokenAndLogout();
    this.tokenService.removeToken();
    this.router.navigate(['/Login']);
  }
}
