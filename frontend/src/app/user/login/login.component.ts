import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ErrorHandlerService],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  errors: any = {};
  loading = false;
  signinSucceed = false;

  constructor(public http: HttpClient,
    public errHandler: ErrorHandlerService,
    public userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userService.whoami().subscribe(res => {
      document.location.href = '/#/';
    }, e => {
    });
  }

  login() {
    this.loading = true;
    this.errors = {};
    this.http.post<User>('/api/login_web', this.user).subscribe(res => {
      this.loading = false;
      this.signinSucceed = true;
      this.userService.authenticatedUser = res;
      this.router.navigate(['/']);
    } , err => {
      this.loading = false;
      this.errors = this.errHandler.HandleResponseErrors(err);
    });
  }

}
