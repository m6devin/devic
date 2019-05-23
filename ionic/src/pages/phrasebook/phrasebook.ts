import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, InfiniteScroll, ToastController, Refresher, Events } from 'ionic-angular';
import { PhrasebookService } from '../../app/services/phrasebook.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';
import { LoadingService } from '../../app/services/loading.service';
import { WordDetailsPage } from '../word-details/word-details';
import { TranslationService } from '../../app/services/translation.service';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-phrasebook',
  templateUrl: 'phrasebook.html',
  providers: [ PhrasebookService, ErrorHandlerService, LoadingService, TranslationService]
})
export class PhrasebookPage implements OnInit {
  filters: any = {
    word: null,
    from_language_alpha2code: null,
    today_review: true,
  };

  words:Array<any> = [];
  basicInfo:any;
  currentPage = 1;
  nextPage = 1;
  lastPage = null;
  infiniteScroll: InfiniteScroll = null;
  refresher: Refresher = null;
  theEnd = false;

  constructor(app: App, public navCtrl: NavController,
    public navParams: NavParams,
    public phrasebookService: PhrasebookService,
    public translationService: TranslationService,
    public errorhandler: ErrorHandlerService,
    public loading: LoadingService,
    public toastCtrl: ToastController,
    public events: Events) {

      this.events.subscribe('word:next', index => {
        if (index == (this.words.length - 1) && this.theEnd == false) {
          console.log(index);

          this.loadNextPage(() => {
            let w = this.words[index+1];
            if (w === undefined) {
              this.toastCtrl.create({
                message: "The end.",
                duration: 2000,
              }).present();
              return;
            }
            this.wordDetails(w);
          });
        }else{
          let w = this.words[index+1];
          if (w === undefined) {
            this.toastCtrl.create({
              message: "The end.",
              duration: 2000,
            }).present();
            return;
          }
          this.wordDetails(w);
        }

      });

      this.events.subscribe('word:previous', index => {
        let w = this.words[index-1];
        if (index == 0) {
          w = this.words[index];
          this.toastCtrl.create({
            message: "It was the first word!",
            duration: 2000,
          }).present();

          return;
        }
        this.wordDetails(w)
      });

      this.events.subscribe('word:update', (index, updatedWord) => {
        this.words[index] = updatedWord;
      });
  }

  ngOnInit() {
    this.translationService.getBasicInfo().subscribe(res => {
      this.basicInfo = res ;
      this.loadNextPage();
    }, err => { });
  }


  ionViewDidLoad() {
  }

  loadNextPage(onSuccess:()=>void= null ){
    this.theEnd = false;

    if (this.currentPage == this.lastPage) {
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }

      if (this.refresher) {
        this.refresher.complete()
      }

      this.theEnd = true;
      if (onSuccess) {
        onSuccess();
      }
      return;
    }
    this.phrasebookService.search(this.nextPage, this.filters).subscribe(res => {
      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
      // this.words = this.words.concat(res.data);
      for(let i = 0; i < res.data.length; i ++) {
        res.data[i]['index'] = ((this.currentPage - 1) * res.per_page) + i;
        this.words.push(res.data[i]);
      }
      this.nextPage++;
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }

      if (this.refresher) {
        this.refresher.complete()
      }
      this.loading.hide();

      this.theEnd = false;
      if (onSuccess) {
        onSuccess();
      }

    }, err => {
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }

      if (this.refresher) {
        this.refresher.complete()
      }

      this.toastCtrl.create({
        message: 'An error accoured! Try again later.',
        duration: 2000,
      }).present();
      this.errorhandler.HandleResponseErrors(err, this.navCtrl);
    });
  }

  /**
   * Load phrasebook data using infinite scrolling
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.loadNextPage();
  }

  /**
   * Start refreshing the page
   * @param refresher Refresher
   */
  doRefresh(refresher: Refresher) {
    this.loading.show();
    this.refresher = refresher;
    this.currentPage = 1;
    this.nextPage = 1;
    this.lastPage = null;
    this.words = [];
    this.loadNextPage();
  }

  /**
   * Show all details of a word in new page
   */
  wordDetails(word: any) {
    this.navCtrl.push(WordDetailsPage, {
      word: word,
      basicInfo: this.basicInfo,
      translationStyle: false,
    });
  }

  recentlyReviewd(word: any): boolean {
    if(word.reviews == undefined || word.reviews == null || word.reviews.length == 0) {
      return false;
    }
    const createdAt = word.reviews[0].created_at;
    const diff = moment().diff(createdAt);

    if ((diff/1000) < (1 * 60)) {
      return true;
    }

    return false;
  }

}
