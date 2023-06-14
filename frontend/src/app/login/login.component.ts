import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../_services/token.service';
import { CoreService } from '../_services/core.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private _coreService: CoreService
  ) {
    this.loginForm = fb.group({
      UserName: '',
      Password: '',
    });
  }
  OnLogin() {
    const { UserName, Password } = this.loginForm.value;
    this.http.post('https://localhost:7271/Login', { userName: UserName, password: Password }).subscribe(
      (response: any) => {
        this.tokenService.setToken(response.Token);
        this.router.navigate(['/Home']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this._coreService.openSnackBar('Invalid username or password. Please try again.', 'Ok')
        } else { 
          this._coreService.openSnackBar('Database is not connected','Ok')
        }
      }
    );
  }
  
}


