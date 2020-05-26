import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}
  canActivate() {
    if (this.auth.token) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
