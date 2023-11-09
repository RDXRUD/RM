import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../_services/token.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.tokenService.removeToken();
        location.reload();
      }
      return throwError(() => err);
    }
    ))
  }
}