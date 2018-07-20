import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { User } from '../../app/models/user';
import { UserService } from '../../app/services/user.service';
import { HomePage } from '../../pages/home/home';
import { LoadingService } from '../../app/services/loading.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';
import { ConfigPage } from '../config/config';
import { SignupPage } from '../signup/signup';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ UserService , LoadingService, ErrorHandlerService],
})
export class LoginPage {
  user = new User();
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

  login() {
    this.loading.show();
    this.errors = {};


    this.userService.login(this.user.email, this.user.password).subscribe((res:any) => {
      localStorage.setItem('api_token', res.token);
      this.navCtrl.setRoot(HomePage);
      this.loading.hide();
    }, err => {
      this.errors = this.errorHandler.HandleResponseErrors(err);
      this.toastCtrl.create({
        message: this.errors.message,
        duration: 3000,
      }).present();
      this.loading.hide();
    });
  }

  goToConfig() {
    this.navCtrl.setRoot(ConfigPage);
  }

  goToSignup() {
    this.navCtrl.setRoot(SignupPage);
  }

}
