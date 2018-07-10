import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { App, MenuController } from 'ionic-angular';

import { TranslationService } from '../../app/services/translation.service';
import { LoadingService } from '../../app/services/loading.service';

import { WordSavePage } from '../word-save/word-save';
import * as _ from 'lodash';

/**
 * Generated class for the TranslationDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-translation-dashboard',
  templateUrl: 'translation-dashboard.html',
  providers: [ TranslationService, LoadingService ]
})
export class TranslationDashboardPage implements OnInit {

  basicInfo: any = {};
  translation: any = {
    from_language: null,
    from_language_id: null,
    to_language: null,
    to_language_id: null,
    word: null,
  };
  translatedWord: any = null;
  /**
   * -1: means the word not searched in the phrasebook
   * 1 : means the word has atleast one translation
   * 2 : means the word searched but no translation found
   */
  hasAnyTranslation: number = -1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    app: App,
    public menu: MenuController,
    public translationService: TranslationService,
    public loading: LoadingService,
    public toastCtrl: ToastController) {
      this.menu.enable(true);
  }

  ngOnInit() {
    this.translationService.getBasicInfo().subscribe(res => {this.basicInfo = res} , err => {});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TranslationDashboardPage');
  }

  /**
   * Navigate to given page
   */
  openPage(page: any) {
    this.navCtrl.push(page);
  }

  /**
   * Close the menu
   */
  closeMenu() {
    this.menu.close();
  }

  /**
   * Invoke translation service to find translations of a word
   */
  translateWord() {
    if (this.validateTranslationRequest() == false) {
      return;
    }

    this.translatedWord = null;
    this.hasAnyTranslation = -1;
    this.loading.show();
    this.translationService.translate(this.translation).subscribe(res => {
      this.loading.hide();
      this.hasAnyTranslation = 1;
      this.translatedWord = res;
    }, err => {
      if (err.status === 404) {
        this.hasAnyTranslation = 2;
      }
      this.loading.hide();
    });
  }

  /**
   * Check required fields of translation
   */
  validateTranslationRequest(): boolean{
    if (this.translation.from_language == null) {
      this.toastCtrl.create({ message: "Please select your source language!", duration: 2000}).present();
      return false;
    }
    if (this.translation.to_language == null) {
      this.toastCtrl.create({ message: "Please select your destination language!", duration: 2000}).present();
      return false;
    }
    if (this.translation.word == null) {
      this.toastCtrl.create({ message: "Word to translate is required!", duration: 2000}).present();
      return false;
    }

    return true;
  }

  wordChanged() {
    this.hasAnyTranslation = -1;
  }

  /**
   * Show word's save form to insert or update given word
   */
  saveWord() {
    if(this.validateSaveWordPage() == false) {
      return;
    }
    this.navCtrl.push(WordSavePage, {
      word: {
        word: this.translation.word,
        language_id: this.translation.from_language,
        language: _.find(this.basicInfo.langs, item => {
          return item.id == this.translation.from_language;
        }),
        id: this.translatedWord != null? this.translatedWord.id : null,
      },
    })
  }

  validateSaveWordPage():boolean {
    if (this.translation.from_language == null) {
      this.toastCtrl.create({ message: "Please select your source language!", duration: 2000}).present();
      return false;
    }
    if (this.translation.to_language == null) {
      this.toastCtrl.create({ message: "Please select your destination language!", duration: 2000}).present();
      return false;
    }
    if (this.translation.word == null) {
      this.toastCtrl.create({ message: "Word to translate is required!", duration: 2000}).present();
      return false;
    }

    if (this.hasAnyTranslation == -1){
      this.toastCtrl.create({ message: "First, search for the word translation!", duration: 2000}).present();
      return false;
    }

    return true;
  }
}
