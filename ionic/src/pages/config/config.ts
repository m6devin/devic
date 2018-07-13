import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage implements OnInit {
  config: any = {
    api_host: null,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
  }

}
