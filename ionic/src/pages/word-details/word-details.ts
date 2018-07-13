import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslationSavePage } from '../translation-save/translation-save';
import { TranslationService } from '../../app/services/translation.service';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-word-details',
  templateUrl: 'word-details.html',
  providers: [TranslationService]
})
export class WordDetailsPage implements OnInit {
  word: any = null;
  basicInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translationService: TranslationService,
    public events: Events) {
    this.word = this.navParams.get('word');
    if (this.word == null) {
      this.navCtrl.pop();
    }

    this.events.subscribe('translation:save', translation => {
      let i = _.findIndex(this.word.translations, item => {
        return item.id == translation.id;
      })

      if (i == -1) {
        return;
      }

      this.word.translations[i] = translation;
    });
  }

  ngOnInit() {
    this.translationService.getBasicInfo().subscribe(res => { this.basicInfo = res }, err => { });
  }

  ionViewDidLoad() {
  }

  /**
   * Call translation from page to create on update a translation
   * @param translation any If you want to add a new translation, pass null otherwise
   * If you want edit an existing translation, pass translation object with ID
   */
  translationSave(translation: any = null){
    this.navCtrl.push(TranslationSavePage, {
      translation: translation,
      word: this.word,
      basicInfo: this.basicInfo,
    });
  }

}
