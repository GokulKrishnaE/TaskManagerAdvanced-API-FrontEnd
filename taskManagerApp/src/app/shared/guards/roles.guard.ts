import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];

    const userRoles = this.authService.getUserRoles();

    console.log(userRoles, typeof userRoles)

    if (userRoles?.some(role => requiredRoles.includes(role))) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
