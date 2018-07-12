import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TranslationDashboardPage } from '../pages/translation-dashboard/translation-dashboard';
import { WordSavePage } from '../pages/word-save/word-save';
import { TranslationSavePage } from '../pages/translation-save/translation-save';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TranslationDashboardPage,
    WordSavePage,
    TranslationSavePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TranslationDashboardPage,
    WordSavePage,
    TranslationSavePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
