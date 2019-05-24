import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../global/pagination/pagination-model';

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

  getBasicInfo() {
    return this.http.get<any>('/api/v2/userarea/word/basic_info');
  }
}
