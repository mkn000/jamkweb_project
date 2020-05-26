import {Component, OnDestroy} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnDestroy {
  login: boolean;
  sub: Subscription;
  user: string;

  constructor(private router: Router, private auth: AuthService) {
    this.sub = this.auth.loginTrue().subscribe(message => {
      this.login = message;
    });

    const atoken = JSON.parse(sessionStorage.getItem('accesstoken'));
    if (atoken) {
      this.login = true;
      this.user = atoken.username;
    } else {
      this.login = false;
    }
  }

  logOut() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  deleteUser() {
    this.auth.delete().subscribe(msg => console.log(msg));
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
