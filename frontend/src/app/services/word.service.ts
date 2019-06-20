import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../global/pagination/pagination-model';
import { Word } from '../models/word';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(public http: HttpClient) { }

  myWordsIndex(page: number = 1, filters = {}): Observable<Pagination<any[]>> {
    if (page <= 0) {
      page = 1;
    }
    return this.http.get<Pagination<any[]>>('/api/v2/userarea/word/index?page=' + page + '&filters=' + JSON.stringify(filters));
  }

  /**
   * 
   * @param wordID If this parameter passes to function, the response will contain this word's details
   */
  getBasicInfo(wordID = null) {
    return this.http.get<any>('/api/v2/userarea/word/basic_info?word_id=' + (wordID ? wordID : ''));
  }

  saveWord(word: Word) {
    let url = '/api/v2/userarea/word/save';
    if (word.id) {
      url += '/' + word.id;
    }
    return this.http.post(url, word);
  }

  deleteWord(id: number): Observable<any> {
    return this.http.get<any>('/api/v2/userarea/word/' + id + '/delete');
  }

  speak(text: string) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  }
}
