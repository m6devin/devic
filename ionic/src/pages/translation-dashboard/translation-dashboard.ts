import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, MenuController } from 'ionic-angular';

import { TranslationService } from '../../app/services/translation.service';
import { LoadingService } from '../../app/services/loading.service';
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
    to_language: null,
    word: null,
  };
  translatedWord: any = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    app: App,
    public menu: MenuController,
    public translationService: TranslationService,
    public loading: LoadingService) {
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

  translateWord() {
    this.translatedWord = null;
    this.loading.show();
    this.translationService.translate(this.translation).subscribe(res => {
      this.loading.hide();
      this.translatedWord = res;
    }, err => {
      this.loading.hide();
    });
  }

}
