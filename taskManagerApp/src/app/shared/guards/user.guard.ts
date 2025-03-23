import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const userGuard: CanActivateFn = (route, state) => {

  let token = localStorage.getItem('netKey')

  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  if (!token || jwtHelper.isTokenExpired(token)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
