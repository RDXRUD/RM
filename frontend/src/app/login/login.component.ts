import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
        },
      // (error) => {
      //   console.error(error);
      // },
    );
  }
}


