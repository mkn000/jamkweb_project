import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg: string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.errorMsg = '';
  }

  signUp(value, valid) {
    if (valid) {
      //this.authService.SignUp(value.tunnus, value.salasana);
      this.auth
        .register(value.tunnus, value.salasana)
        .subscribe((result: {success: boolean; message: string}) => {
          if (result.success) {
            setTimeout(_ => this.signIn(value.tunnus, value.salasana), 200);
          } else {
            this.errorMsg = result.message;
          }
        });
    }
  }

  signIn(value, valid) {
    if (valid) {
      this.auth.login(value.tunnus, value.salasana).subscribe(result => {
        if (result) {
          setTimeout(_ => this.router.navigate(['/user']), 200);
        } else {
          this.errorMsg = 'Incorrect username or password';
        }
      });
    }
  }
}
