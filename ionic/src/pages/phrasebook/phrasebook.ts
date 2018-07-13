import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, InfiniteScroll, ToastController } from 'ionic-angular';
import { PhrasebookService } from '../../app/services/phrasebook.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';
import { LoadingService } from '../../app/services/loading.service';



@IonicPage()
@Component({
  selector: 'page-phrasebook',
  templateUrl: 'phrasebook.html',
  providers: [ PhrasebookService, ErrorHandlerService, LoadingService]
})
export class PhrasebookPage implements OnInit {
  filters: any = {
    word: null,
    from_language_id: null,
  };

  words:Array<any> = [];
  currentPage = 1;
  nextPage = 1;
  lastPage = null;
  infiniteScroll: InfiniteScroll = null;
  theEnd = false;

  constructor(app: App, public navCtrl: NavController,
    public navParams: NavParams,
    public phrasebookService: PhrasebookService,
    public errorhandler: ErrorHandlerService,
    public loading: LoadingService,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.loadNextPage();
  }


  ionViewDidLoad() {
  }

  loadNextPage(){
    this.theEnd = false;
    if (this.currentPage == this.lastPage) {
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }
      this.theEnd = true;

      return;
    }
    this.phrasebookService.search(this.nextPage, this.filters).subscribe(res => {
      this.currentPage = res.current_page;
      this.lastPage = res.last_page;
      this.words = this.words.concat(res.data);
      this.nextPage++;
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }
    }, err => {
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
      }
      this.toastCtrl.create({
        message: 'An error accoured! Try again later.',
        duration: 2000,
      }).present();
      this.errorhandler.HandleResponseErrors(err, this.navCtrl);
    });
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.loadNextPage();
  }

}
