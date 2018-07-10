import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as cnf from '../config';

@Injectable()
export class TranslationService {
  constructor(public http: HttpClient) { }

  /**
   * Load basic information from server
   * @return Observable<any>
   */
  getBasicInfo(): Observable<any> {
    return this.http.get<any>(cnf.HOST + '/api/translation/basic_info');
  }

  translate(translation: any) {
    let token = localStorage.getItem('api_token');
    return this.http.get<any>(cnf.HOST + '/api/translation/translate?token=' + token
      + '&from_language=' + (translation.from_language ? translation.from_language : '')
        + '&to_language=' + (translation.to_language ? translation.to_language : '')
        + '&word=' + (translation.word ? translation.word : '')
    );
  }
}
