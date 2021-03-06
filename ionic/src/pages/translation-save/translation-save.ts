import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';


// import * as _ from 'lodash';
import { TranslationService } from '../../app/services/translation.service';
import { LoadingService } from '../../app/services/loading.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';

@IonicPage()
@Component({
  selector: 'page-translation-save',
  templateUrl: 'translation-save.html',
  providers: [ TranslationService, LoadingService, ErrorHandlerService]
})
export class TranslationSavePage {
  word: any;
  basicInfo: any = {};
  translation: any = {};
  errors: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translationService: TranslationService,
    public loading: LoadingService,
    public toastCtrl: ToastController,
    public errorHandler: ErrorHandlerService,
    public events: Events) {
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
      this.translation.to_language_id = trs.language_id;
    } else {
      // set Persian as default
      this.translation.to_language_id = this.basicInfo.langs[0].id;
    }

    this.translation.word_id = this.word.id;
    this.translation.from_language_id = this.word.language_id;
  }

  /**
   * Handle saving of a translation
   */
  saveTranslation() {
    this.errors = {};
    this.loading.show();


    this.translation.language_id = this.translation.to_language_id;

    this.translationService.saveTranslation(this.translation)
    .subscribe(res => {
      this.translation = res;
      this.events.publish('translation:save', this.translation);
      this.loading.hide();
      this.toastCtrl.create({
        message: "Translations saved!",
        duration: 2000,
      }).present();
      this.navCtrl.pop();
    }, err => {
      this.errors = this.errorHandler.HandleResponseErrors(err, this.navCtrl);
      this.loading.hide();
    });
  }

}
