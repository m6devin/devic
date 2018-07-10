import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingService {
  loader: Loading;

  constructor(public loadingCtrl: LoadingController) { }

  public show() {

      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
      });
      this.loader.present();

  }

  public hide() {
    if (this.loader == null || this.loader === undefined) {
      return;
    }
    this.loader.dismiss();
  }
}
