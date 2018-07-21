import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import * as cnf from '../config';
@Injectable()
export class PhrasebookService{
  token: string = '';
  cnf = new cnf.Config();

  constructor(public http: HttpClient){
    this.token = localStorage.getItem('api_token');
  }

  /**
   * Search the phrasebook
   */
  search(page:number, filters: any): Observable<any>{
    if(filters == undefined || filters == null) {
      filters = {};
    }
    if(!page || page <=0 ){
      page = 1;
    }

    return this.http.get<any>(this.cnf.getHost() + '/api/translation/phrasebook?page=' + page + '&filters=' + JSON.stringify(filters) + '&token=' + this.token);
  }
}
