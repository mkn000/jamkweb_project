import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard  {
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
