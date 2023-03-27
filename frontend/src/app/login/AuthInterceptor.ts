import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private jwtHelper: JwtHelperService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const headers = request.headers.set('Authorization', `Bearer ${token}`);
      request = request.clone({ headers });
    }

    return next.handle(request);
  }
}