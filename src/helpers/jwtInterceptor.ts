import { Injectable, } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { DomainProvider } from 'src/providers/domainProvider';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public UnAccessAPIList = [];
  constructor(
    public router: Router,
    public domainProvider: DomainProvider,
  ) { }

  addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.domainProvider.getStorage('accessToken');
    // (RefreshToken API) 不用帶accessToken
    if (token && !this.UnAccessAPIList.some(item => request.url.includes(item))) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    const req = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });

    return next.handle(req);
  }
}


