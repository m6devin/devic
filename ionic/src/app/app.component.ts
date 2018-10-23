import { Component, ViewChild } from '@angular/core';
import { Platform, App, Nav, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TranslationDashboardPage } from '../pages/translation-dashboard/translation-dashboard';
import { PhrasebookPage } from '../pages/phrasebook/phrasebook';
import { ConfigPage } from '../pages/config/config';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  pages = [
    { label: 'Translation', component: TranslationDashboardPage, icon: 'git-compare' },
    { label: 'Phrasebook', component: PhrasebookPage, icon: 'book'},
    { label: 'Config', component: ConfigPage, icon: 'settings' },
  ];

  rootPage: any = HomePage;

  constructor(platform: Platform,
    public app: App,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _ionicApp: IonicApp,
    private _menu: MenuController) {
    platform.ready().then(() => {

      history.pushState(null, null, '');
      localStorage.setItem('lastPage', null);

      statusBar.styleDefault();
      splashScreen.hide();
      // this.setupBackButtonBehavior();

    });

  }


  openPage(page) {
    this.nav.setRoot(page.component);
  }

  get userInfo() {
    let user: any = localStorage.getItem('user');
    if (user === undefined ) {
      return '';
    }

    user = JSON.parse(user);
    if (user === null) {
      return;
    }

    return user.name ? user.name : user.email;
  }

  logout() {
    localStorage.removeItem('api_token');
    this.nav.setRoot(LoginPage);
  }

  // private setupBackButtonBehavior() {
  //   // If on web version (browser)
  //   if (window.location.protocol !== "file:") {

  //     // Register browser back button action(s)
  //     window.onpopstate = (evt) => {
  //       // Close menu if open
  //       if (this._menu.isOpen()) {
  //         this._menu.close();
  //         return;
  //       }

  //       // Close any active modals or overlays
  //       let activePortal = this._ionicApp._loadingPortal.getActive() ||
  //         this._ionicApp._modalPortal.getActive() ||
  //         this._ionicApp._toastPortal.getActive() ||
  //         this._ionicApp._overlayPortal.getActive();

  //       if (activePortal) {
  //         activePortal.dismiss();
  //         return;
  //       }

  //       switch (localStorage.getItem('lastPage')) {
  //         case "WordDetailsPage":
  //           if (this.nav.canGoBack()) this.nav.pop();
  //           return false;
  //         default:
  //           console.log(history.length);
  //           return false;
  //       }

  //     };

  //     // Fake browser history on each view enter
  //     this.app.viewDidEnter.subscribe((app) => {
  //       localStorage.setItem('lastPage', app.name);
  //       switch (app.name) {
  //         case "WordDetailsPage":
  //           history.pushState(null, null, '');
  //           return false;
  //         default:
  //           break;
  //       }
  //     });

  //   }

  // }
}

