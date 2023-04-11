import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';

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
     private router:Router
  ) {
    this.loginForm = fb.group({
      UserName: '',
      Password:'',
    });
  }
    OnLogin() {
      const{UserName,Password} =this.loginForm.value;
      this.http.post('https://localhost:7271/Login',{userName: UserName,password:Password}).subscribe(
        (response:any) => {
          this.tokenService.setToken(response.Token);
          console.warn(response);
          this.router.navigate(['/Home']);
        },   
    );
  }
}


