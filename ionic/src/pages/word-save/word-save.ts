import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-word-save',
  templateUrl: 'word-save.html',
})
export class WordSavePage {

  word: any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.word = this.navParams.get('word');
    if (this.word == null || this.word == undefined ){
      this.navCtrl.pop();
    }
  }

}
