import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-translation-save',
  templateUrl: 'translation-save.html',
})
export class TranslationSavePage {
  word: any;
  basicInfo: any = {};
  translation: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let wd = this.navParams.get('word');
    let trs = this.navParams.get('translation');
    this.basicInfo = this.navParams.get('basicInfo');

    if (wd == null) {
      this.navCtrl.pop();
    }
    this.word = wd;

    if (trs != null) {
      this.translation = trs;
    }
  }

}
