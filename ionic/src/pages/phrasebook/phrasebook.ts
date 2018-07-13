import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicApp } from 'ionic-angular';

/**
 * Generated class for the PhrasebookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phrasebook',
  templateUrl: 'phrasebook.html',
})
export class PhrasebookPage {

  constructor(app: IonicApp, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhrasebookPage');
  }

}
