import { Component } from '@angular/core';
import { TokenService } from '../login/token.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  private readonly JWT_TOKEN = 'JWT_TOKEN';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  public logout(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isLoggedIn.next(false);
    this.router.navigate(['/Login']);
  }
}

