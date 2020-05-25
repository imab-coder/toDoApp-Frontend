import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    public toastr: ToastrService,
    public router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => {
      if (error && (error.status == 404 || error.status == 400)) {
        this.toastr.error(error.error.message);
        this.router.navigate(['']);
      }else if(error && error.status == 0){
        this.toastr.error(error.message);
        this.router.navigate(['']);
      }
      return of(error);
    }));
  }
}
