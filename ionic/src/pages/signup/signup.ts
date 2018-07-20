import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ErrorHandlerService } from '../../app/services/error-handler.service';
import { LoadingService } from '../../app/services/loading.service';
import { UserService } from '../../app/services/user.service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [ ErrorHandlerService, UserService, LoadingService],
})
export class SignupPage {
  user: any = {};
  errors: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public loading: LoadingService,
    public errorHandler: ErrorHandlerService,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
  }

  signup() {
    this.loading.show();
    this.errors = {};
    this.userService.signup(this.user.email, this.user.password, this.user.password_confirmation).subscribe((res: any) => {
      localStorage.setItem('api_token', res.token);
      this.loading.hide();
      this.toastCtrl.create({
        message: 'Your account successfully created!',
        duration: 3000,
      });
      this.navCtrl.setRoot(HomePage);
    }, err => {
      this.errors = this.errorHandler.HandleResponseErrors(err);
      this.toastCtrl.create({
        message: this.errors.message,
        duration: 3000,
      }).present();
      this.loading.hide();
    });
  }

}
