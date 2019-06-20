import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private http: HttpClient) { }

  getBasicInfo(): Observable<any[]> {
    return this.http.get<any[]>('/api/v2/userarea/translate/basic_info');
  }

  searchForTranslation(word: any): Observable<any> {
    return this.http.post<any>('/api/v2/userarea/translate/search', word);
  }

  save(translation: any) {
    let url = '/api/v2/userarea/translate/save';
    if (translation.id) {
      url += '/' + translation.id;
    }
    return this.http.post<any>(url, translation);
  }

  deleteTranslation(id: number): Observable<any> {
    return this.http.get<any>('/api/v2/userarea/translate/' + id + '/delete');
  }

  callGoogleTranslate(text: string) {
    return this.http.get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&hl=en-US&dt=t&dt=bd&dj=1&source=icon&tk=573754.573754&q=' + text)
  }
}
