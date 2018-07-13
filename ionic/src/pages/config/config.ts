import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage implements OnInit {
  config: any = {
    api_host: null,
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    for (let c in this.config) {
      this.config[c] = localStorage.getItem(c);
    }
  }

  ionViewDidLoad() {

  }

  saveConfig() {
    for (let c in this.config) {
      localStorage.setItem(c, this.config[c]);
    }

    this.toastCtrl.create({
      message: "Configuration updated.",
      duration: 1500,
    }).present();
  }

  goBack(){
    this.navCtrl.setRoot(HomePage);
  }

}
