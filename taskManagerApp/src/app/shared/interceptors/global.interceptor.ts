import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  apiURL = environment.API_URL

  constructor(private loginService:AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let token =  this.loginService.getToken()

    let newRequest = request.clone({
      url: this.apiURL+ request.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next.handle(newRequest);
  }
}
