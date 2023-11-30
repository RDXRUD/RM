import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../_services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public spinnerService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.spinnerService.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(
        () => {
        //   this.spinnerService.isLoading.next(false);
        }
      )
    );
  }
}

// if (this.spinnerService.isLoading.getValue()) {
//     this.spinnerService.isLoading.next(true);
//   } else {
//     this.spinnerService.isLoading.next(false);
//   }