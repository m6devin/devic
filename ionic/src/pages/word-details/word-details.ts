import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { TranslationSavePage } from '../translation-save/translation-save';
import { TranslationService } from '../../app/services/translation.service';
import * as _ from 'lodash';
import { LoadingService } from '../../app/services/loading.service';
import { Clipboard } from '@ionic-native/clipboard';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import * as moment from "moment";
import { WordSavePage } from '../word-save/word-save';

@IonicPage()
@Component({
  selector: 'page-word-details',
  templateUrl: 'word-details.html',
  providers: [TranslationService, LoadingService]
})
export class WordDetailsPage implements OnInit {
  word: any = null;
  basicInfo: any = {};
  exampleIsPlaying = false;
  definitionIsPlaying = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translationService: TranslationService,
    public events: Events,
    public loading: LoadingService,
    public clipboard: Clipboard,
    public toastCtrl: ToastController,
    public tts: TextToSpeech) {
    this.word = this.navParams.get('word');
    if (this.word == null) {
      this.navCtrl.pop();
    }

    this.basicInfo = this.navParams.get('basicInfo');

    this.events.subscribe('translation:save', translation => {
      let i = _.findIndex(this.word.translations, item => {
        return item.id == translation.id;
      })

      if (i == -1) {
        this.word.translations.push(translation);
        return;
      }

      this.word.translations[i] = translation;
    });
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
  }

  /**
   * Call translation from page to create on update a translation
   * @param translation any If you want to add a new translation, pass null otherwise
   * If you want edit an existing translation, pass translation object with ID
   */
  translationSave(translation: any = null) {
    this.navCtrl.push(TranslationSavePage, {
      translation: translation,
      word: this.word,
      basicInfo: this.basicInfo,
    });
  }

  editWord() {
    this.navCtrl.push(WordSavePage, {
      word: this.word,
      basicInfo: this.basicInfo,
    })
  }

  /**
   * Handle swip left and swip right
   * @param e event
   */
  handleSwipe(e: any) {
    if (e.direction == 2) {
      this.nextItem();
      return;
    }

    if (e.direction == 4) {
      this.previousItem();
      return;
    }

  }

  /**
   * Load next word in phrasebook
   */
  nextItem() {
    this.loading.show();
    this.navCtrl.pop();
    this.events.publish('word:next', this.word.index);
    this.loading.hide();
  }

  /**
   * Load next word in phrasebook
   */
  previousItem() {
    this.loading.show();
    this.navCtrl.pop();
    this.events.publish('word:previous', this.word.index);
    this.loading.hide();
  }

  /**
   * Copy word to clipboard
   */
  copyToClipboard() {
    this.translationService.copyToClipboard('the_word');
  }

  speak(text: string, player?: string) {
    this.stopAllPlayers();
    this.toggleMediaButtons(true, player);
    this.tts.speak(text).then(ok => {
      this.toggleMediaButtons(false, player);
     }, err => {
      this.toggleMediaButtons(false, player);
      this.toastCtrl.create({
        message: 'TTS not supported!',
        duration: 2000,
      }).present();
    });

  }

  stopSpeaking(player?: string) {
    this.tts.speak(' ').then(ok => {
      this.toggleMediaButtons(false, player);
    }, err => {
    });
  }

  toggleMediaButtons(isPlaying: boolean, player?: string) {
    if (! player) {
      this.exampleIsPlaying = isPlaying;
      this.definitionIsPlaying = isPlaying;
      return;
    }

    switch(player) {
      case 'example' : {
        this.exampleIsPlaying = isPlaying;
        break;
      }
      case 'definition' : {
        this.definitionIsPlaying = isPlaying;
        break;
      }
    }
  }

  stopAllPlayers() {
    this.exampleIsPlaying = false;
    this.definitionIsPlaying = false;
    this.tts.speak(' ').then(ok => {
    }, err => {
    });
  }

  setReview(status: boolean) {
    this.loading.show();
    this.translationService.setReview(this.word.id, status).subscribe(res => {
      res['index'] = this.word.index;
      this.word = res;
      this.events.publish('word:update', this.word.index, this.word);
      this.loading.hide();
      this.toastCtrl.create({
        message: "Done!",
        duration: 2000,
      }).present();
    }, err => {
      this.loading.hide();
      this.toastCtrl.create({
        message: err.error.message,
        duration: 4000,
      }).present();
    });
  }

  get canReview() {
    if (null == this.word.step_id) {

      return true;
    }

    const lastReview = this.word.reviews ? this.word.reviews[0] : null;
    if (!lastReview) {
      return true;
    }

    const now = moment().unix();
    const lastReviewTimestamp = moment(lastReview.created_at, "YYYY-MM-DD HH:mm:ss").unix();
    const diff = now - lastReviewTimestamp;

    if (diff < (5 * 60)) {
      return true;
    }

    const nextReview = lastReviewTimestamp + (this.word.step.days * (24 * 60 * 60));
    const minReviewAvailable = nextReview - (8 * 60 * 60);
    if (minReviewAvailable >= now) {
      return false;
    }

    return true;

  }



}
