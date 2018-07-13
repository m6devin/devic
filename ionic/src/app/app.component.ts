import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TranslationDashboardPage } from '../pages/translation-dashboard/translation-dashboard';
import { PhrasebookPage } from '../pages/phrasebook/phrasebook';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  pages = [
    { label: 'Translation', component: TranslationDashboardPage },
    { label: 'Phrasebook', component: PhrasebookPage },
  ];

  rootPage: any = HomePage;

  constructor(platform: Platform,
    public app: App,
    statusBar: StatusBar,
    splashScreen: SplashScreen) {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      });

  }


  openPage(page) {

    let nav =this.app.getActiveNavs()
    nav[0].setRoot(page.component);
  }
}

