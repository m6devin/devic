import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { App, NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class ErrorHandlerService {

  constructor(public app: App) { }

  HandleResponseErrors(err: HttpErrorResponse, navCtrl: NavController = null): any {
    console.log(err)
    switch (err.status) {
      case 404:
      case 406:
      case 422: {
        let r = err.error.errors;
        if (r == null) {
          r = {};
        }
        r.message = err.error.message;
        return r;
      }
      case 401: {
        let r = err.error.errors;
        if (r == null) {
          r = {};
        }
        r.message = err.error.message;
        if (navCtrl) {
          navCtrl.setRoot(LoginPage);
        }

        break;
      }
      case 504: {
        return err;
      }
      default:
        return {};
    }
  }
}
