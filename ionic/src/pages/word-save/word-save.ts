import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';


import { TranslationService } from '../../app/services/translation.service';
import { LoadingService } from '../../app/services/loading.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';
import * as  _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-word-save',
  templateUrl: 'word-save.html',
  providers: [ TranslationService, LoadingService, ErrorHandlerService],
})
export class WordSavePage {

  word: any = null;
  basicInfo: any = {};
  errors: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translationService: TranslationService,
    public loading: LoadingService,
    public toastCtrl: ToastController,
    public errorHandler: ErrorHandlerService) {

  }

  ionViewDidLoad() {
    this.word = this.navParams.get('word');
    this.basicInfo = this.navParams.get('basicInfo');

    if (this.word == null || this.word == undefined ){
      this.navCtrl.pop();
    }
  }

  /**
   * Save updates of word
   */
  saveWord() {
    this.loading.show();
    let payload: any = this.createSavePayload();
    this.errors = {};

    this.translationService.saveWord(payload).subscribe(res => {
      this.word = res;
      this.loading.hide();
      this.toastCtrl
        .create({ message: 'Word updated successfully!', duration: 2000 })
        .present();
    }, err => {
      this.errors = this.errorHandler.HandleResponseErrors(err);
      this.toastCtrl.create({
        message: this.errors.message,
        duration: 3000,
      }).present();
      this.loading.hide();
    });
  }

  /**
   * Create an object to send to server
   */
  createSavePayload() {
    let payload: any = {
      word: this.word.word,
      id: this.word.id,
    };

    let lang: any =  _.find(this.basicInfo.langs, item => {
      return item.id == this.word.language_id;
    })

    if (lang == undefined) {
      return payload;
    }

    payload.language_alph2code = lang.alpha2code;
    return payload;
  }

}
