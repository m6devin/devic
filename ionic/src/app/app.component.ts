import { Component, ViewChild } from '@angular/core';
import { Platform, App, Nav, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TranslationDashboardPage } from '../pages/translation-dashboard/translation-dashboard';
import { PhrasebookPage } from '../pages/phrasebook/phrasebook';
import { ConfigPage } from '../pages/config/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  pages = [
    { label: 'Translation', component: TranslationDashboardPage },
    { label: 'Phrasebook', component: PhrasebookPage },
    { label: 'Config', component: ConfigPage },
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
      statusBar.styleDefault();
      splashScreen.hide();
      this.setupBackButtonBehavior();

    });

  }


  openPage(page) {
    this.nav.setRoot(page.component);
  }

  private setupBackButtonBehavior() {
    // If on web version (browser)
    if (window.location.protocol !== "file:") {

      // Register browser back button action(s)
      window.onpopstate = (evt) => {
        // Close menu if open
        if (this._menu.isOpen()) {
          this._menu.close();
          return;
        }

        // Close any active modals or overlays
        let activePortal = this._ionicApp._loadingPortal.getActive() ||
          this._ionicApp._modalPortal.getActive() ||
          this._ionicApp._toastPortal.getActive() ||
          this._ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss();
          return;
        }

        switch (localStorage.getItem('lastPage')) {
          case "WordDetailsPage":
            if (this.nav.canGoBack()) this.nav.pop();
            return false;
          default:
            console.log(history.length);
            return false;
        }

      };

      // Fake browser history on each view enter
      this.app.viewDidEnter.subscribe((app) => {
        localStorage.setItem('lastPage', app.name);
        switch (app.name) {
          case "WordDetailsPage":
            history.pushState(null, null, '');
            return false;
          default:
            break;
        }
      });

    }

  }
}

