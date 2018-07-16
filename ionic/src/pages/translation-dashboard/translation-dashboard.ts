import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { MenuController, Refresher } from 'ionic-angular';

import { TranslationService } from '../../app/services/translation.service';
import { LoadingService } from '../../app/services/loading.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';

import { WordSavePage } from '../word-save/word-save';
import * as _ from 'lodash';
import { TranslationSavePage } from '../translation-save/translation-save';

@IonicPage({segment: 'translation'})
@Component({
  selector: 'page-translation-dashboard',
  templateUrl: 'translation-dashboard.html',
  providers: [TranslationService, LoadingService, ErrorHandlerService]
})
export class TranslationDashboardPage implements OnInit {

  refresher: Refresher = null;
  basicInfo: any = {};
  errors: any = {};
  translatedWord: any = null;
  translation: any = {
    from_language: null,
    from_language_id: null,
    to_language: null,
    to_language_id: null,
    word: null,
  };
  /**
   * -1: means the word not searched in the phrasebook
   * 1 : means the word searched and exists in the DB
   * 2 : means the word searched but not found in the DB
   */
  hasAnyTranslation: number = -1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public translationService: TranslationService,
    public loading: LoadingService,
    public toastCtrl: ToastController,
    public errorHandler: ErrorHandlerService,
    public events: Events) {

      this.menu.enable(true);
      this.events.subscribe('word:save', word => {
        this.translation.word = word.word;
        this.translation.from_language = word.language_id;

      });
      this.events.subscribe('translation:save', translation => {
        this.translateWord();
      });
  }

  ngOnInit() {
    this.translationService.getBasicInfo().subscribe(res => { this.basicInfo = res }, err => { });
    let lastFrom = this.getLastLang('from');
    let lastTo = this.getLastLang('to');
    if (lastFrom) {
      this.translation.from_language = lastFrom;
    }
    if (lastTo) {
      this.translation.to_language = lastTo;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TranslationDashboardPage');
  }

  /**
   * Navigate to given page
   */
  openPage(page: any) {
    this.navCtrl.setRoot(page);
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
  translateWord(showLoading = true) {
    if (this.validateTranslationRequest() == false) {
      if (this.refresher != null) {
        this.refresher.complete();
      }
      return;
    }

    this.translatedWord = null;
    this.hasAnyTranslation = -1;
    if (showLoading) {
      this.loading.show();
    }
    this.translationService.translate(this.translation).subscribe(res => {
      if (showLoading) {
        this.loading.hide();
      }
      this.hasAnyTranslation = 1;
      this.translatedWord = res;

      if (this.refresher != null) {
        this.refresher.complete();
      }

    }, err => {
      if (err.status === 404) {
        this.hasAnyTranslation = 2;
      }
      if (showLoading) {
        this.loading.hide();
      }
      if (this.refresher != null) {
        this.refresher.complete();
      }

    });
  }

  /**
   * Start refreshing the page
   * @param refresher Refresher
   */
  doRefresh(refresher: any) {
    this.refresher = refresher;
    this.translateWord(false);
  }

  /**
   * Check required fields of translation
   */
  validateTranslationRequest(): boolean {
    if (this.translation.from_language == null) {
      this.toastCtrl.create({ message: "Please select your source language!", duration: 2000 }).present();
      return false;
    }
    if (this.translation.to_language == null) {
      this.toastCtrl.create({ message: "Please select your destination language!", duration: 2000 }).present();
      return false;
    }
    if (this.translation.word == null) {
      this.toastCtrl.create({ message: "Word to translate is required!", duration: 2000 }).present();
      return false;
    }

    return true;
  }

  wordChanged() {
    this.hasAnyTranslation = -1;
  }

  clear() {
    this.translation.word = null
    this.wordChanged();
  }

  /**
   * Show word's save form to insert or update given word
   */
  saveWord() {
    if (this.validateSaveWordFields() == false) {
      return;
    }

    this.loading.show();
    this.errors = {};

    let word: any = {
      word: this.translation.word,
      language_id: this.translation.from_language,
      language: _.find(this.basicInfo.langs, item => {
        return item.id == this.translation.from_language;
      }),
      to_language_id: this.translation.to_language,
      to_language: _.find(this.basicInfo.langs, item => {
        return item.id == this.translation.to_language;
      }),

      id: this.translatedWord != null ? this.translatedWord.id : null,
    };

    word.language_alph2code = word.language.alpha2code;

    // Directly add to phrasebook
    if (this.translatedWord == null) {
      this.createWord(word);
      return;
    }

    this.loading.hide();

    this.navCtrl.push(WordSavePage, {
      word: word,
      basicInfo: this.basicInfo,
    })
  }

  /**
   * Invoke create service for word and handle response errors
   * @param word any
   */
  createWord(word) {
    let payload: any = {
      word: word.word,
      language_alph2code: word.language_alph2code,
    };
    this.translationService.saveWord(payload).subscribe(res => {
      this.hasAnyTranslation = 1;
      this.translatedWord = res;
      this.loading.hide();
      this.toastCtrl
        .create({ message: 'Word added to phrasebook successfully!', duration: 2000 })
        .present();
    }, err => {
      this.errors = this.errorHandler.HandleResponseErrors(err, this.navCtrl);
      this.toastCtrl.create({
        message: this.errors.message,
        duration: 3000,
      }).present();
      this.loading.hide();
    });
  }

  validateSaveWordFields(): boolean {
    if (this.translation.from_language == null) {
      this.toastCtrl.create({ message: "Please select your source language!", duration: 2000 }).present();
      return false;
    }
    if (this.translation.to_language == null) {
      this.toastCtrl.create({ message: "Please select your destination language!", duration: 2000 }).present();
      return false;
    }
    if (this.translation.word == null) {
      this.toastCtrl.create({ message: "Word to translate is required!", duration: 2000 }).present();
      return false;
    }

    if (this.hasAnyTranslation == -1) {
      this.toastCtrl.create({ message: "First, search for the word translation!", duration: 2000 }).present();
      return false;
    }

    return true;
  }

  /**
   * Set last selected language on translation form
   * @param target string
   *
   */
  setLastLang(target: string) {
    localStorage.setItem("last_" + target + "_language", this.translation[target + "_language"]);
  }

  /**
   * Get last value saved for a language
   * @param target string
   */
  getLastLang(target: string): string {
    return localStorage.getItem("last_" + target + "_language");
  }

  /**
   * Call translation from page to create on update a translation
   * @param translation any If you want to add a new translation, pass null otherwise
   * If you want edit an existing translation, pass translation object with ID
   */
  translationSave(translation: any = null){
    this.navCtrl.push(TranslationSavePage, {
      translation: translation,
      word: this.translatedWord,
      basicInfo: this.basicInfo,
    });
  }

}
