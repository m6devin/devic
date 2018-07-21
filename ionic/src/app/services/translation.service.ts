import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ToastController } from 'ionic-angular';

import * as cnf from '../config';

@Injectable()
export class TranslationService {
  token: string = "";
  cnf = new cnf.Config();

  constructor(public http: HttpClient, private toasCtrl: ToastController) {
    this.token = localStorage.getItem('api_token');
  }

  /**
   * Load basic information from server
   * @return Observable<any>
   */
  getBasicInfo(): Observable<any> {
    return this.http.get<any>(this.cnf.getHost() + '/api/translation/basic_info');
  }

  translate(translation: any) {
    return this.http.get<any>(this.cnf.getHost() + '/api/translation/translate?token=' + this.token
      + '&from_language=' + (translation.from_language ? translation.from_language : '')
        + '&to_language=' + (translation.to_language ? translation.to_language : '')
        + '&word=' + (translation.word ? translation.word : '')
    );
  }

  /**
   * Invoke API service to create or update word.
   * @param word any
   */
  saveWord(word: any): Observable<any> {
    return this.http.post<any>(this.cnf.getHost() + "/api/translation/save_word?token=" + this.token, word);
  }

  /**
   * Call translation API to create or update a translation
   * @param translation object
   */
  saveTranslation(translation: any): Observable<any> {
    return this.http.post(this.cnf.getHost() + '/api/translation/save_translation?token=' + this.token, translation);
  }

  /**
   * Copy element content to clipboard
   * @param elementID HTML element ID value
   */
  copyToClipboard(elementID: string) {
    let node = document.getElementById(elementID);
    if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    } else {
        this.toasCtrl.create({
          message: 'Unable to copy text! Please do it manualy.',
          duration: 2000,
        }).present();
        return
    }

    this.toasCtrl.create({
      message: "Copied!",
      duration: 1000,
    }).present();
  }
}
