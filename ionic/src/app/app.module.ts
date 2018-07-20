import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { WebIntent } from '@ionic-native/web-intent';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Deeplinks } from '@ionic-native/deeplinks';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TranslationDashboardPage } from '../pages/translation-dashboard/translation-dashboard';
import { WordSavePage } from '../pages/word-save/word-save';
import { TranslationSavePage } from '../pages/translation-save/translation-save';
import { PhrasebookPage } from '../pages/phrasebook/phrasebook';
import { WordDetailsPage } from '../pages/word-details/word-details';
import { ConfigPage } from '../pages/config/config';
import { SignupPage } from '../pages/signup/signup';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TranslationDashboardPage,
    WordSavePage,
    TranslationSavePage,
    PhrasebookPage,
    WordDetailsPage,
    ConfigPage,
    SignupPage
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
    PhrasebookPage,
    WordDetailsPage,
    ConfigPage,
    SignupPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    WebIntent,
    Deeplinks,
    TextToSpeech,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
