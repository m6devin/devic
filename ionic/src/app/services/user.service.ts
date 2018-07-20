import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable} from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import * as cnf from '../config';

@Injectable()
export class UserService {

  constructor(public http: HttpClient) { }

  /**
   * Try to login user usering email and password
   * @param email string
   * @param password string
   */
  login(email: string, password: string) {
    return this.http.post(cnf.HOST + '/api/login', {
      email: email,
      password: password,
    });
  }
  /**
   * Try to login user usering email and password
   * @param email string
   * @param password string
   */
  signup(email: string, password: string, password_confirmation: string) {
    return this.http.post(cnf.HOST + '/api/signup', {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    });
  }

  /**
   * Load authenticated user data from server using api token
   */
  getAuthenticatedUser():Observable<any> {
    let token = localStorage.getItem('api_token');
    if(token === undefined || token === '' || token === null) {
      return new ErrorObservable(false);
    }

    return this.http.get(cnf.HOST + '/api/get_user?token=' + token);
  }

}
