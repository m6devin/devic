import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
// import { TranslationDashboardPage } from '../translation-dashboard/translation-dashboard';

import { UserService } from '../../app/services/user.service';
import { LoadingService } from '../../app/services/loading.service';
// import { TranslationDashboardPage } from '../translation-dashboard/translation-dashboard';
import { PhrasebookPage } from '../phrasebook/phrasebook';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserService, LoadingService ]
})
export class HomePage implements OnInit {

  constructor(public navCtrl: NavController,
    public userService: UserService,
    public loading: LoadingService) {

  }

  ngOnInit() {
    if (localStorage.getItem('api_host') == null) {
      localStorage.setItem('api_host', 'http://devict.m6d.ir');
    }

    this.loading.show();
    this.userService.getAuthenticatedUser().subscribe(res => {
      this.loading.hide();
      this.navCtrl.setRoot(PhrasebookPage);
    } , err => {
      this.loading.hide();
      this.navCtrl.setRoot(LoginPage);
    });
  }



}
