import {Component, OnDestroy} from '@angular/core';
import {AuthService} from '../auth.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../app.component.css']
})
export class UserComponent implements OnDestroy {
  sub: Subscription;
  user: string;
  gamesp: number;
  pb: number;

  constructor(
    private router: Router,
    private auth: AuthService,
    private userS: UserService
  ) {
    const atoken = JSON.parse(sessionStorage.getItem('accesstoken'));
    if (atoken) {
      this.user = atoken.username;
    }
    this.sub = this.userS
      .fetchUser()
      .subscribe((data: {name: string; score: number; gamesplayed: number}) => {
        this.pb = data.score;
        this.gamesp = data.gamesplayed;
      });
  }

  logOut() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  deleteUser() {
    this.auth.delete().subscribe((msg: {success: boolean; message: string}) => {
      if (msg.success) {
        this.logOut();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
