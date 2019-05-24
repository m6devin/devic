import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';
import { Pagination } from '../global/pagination/pagination-model';

@Injectable()
export class UserService {

  static _authenticatedUser: User = new User();
  static _authenticatedUserSubject: Subject<any> = new Subject<any>();

  static _permissions: any = {};

  constructor(public http: HttpClient) { }

  set authenticatedUser(user: User) {
    UserService._authenticatedUser = user;
    UserService._permissions = user.permissions || {};
    UserService._authenticatedUserSubject.next(user);
  }

  get authenticatedUser() {
    return UserService._authenticatedUser;
  }

  get authenticatedUserSubject() {
    return UserService._authenticatedUserSubject.asObservable();
  }

  setAuthenticatedUserSubject(user: any) {
    // tslint:disable-next-line:forin
    for (const k in user) {
      UserService._authenticatedUser[k] = user[k];
    }
    UserService._authenticatedUserSubject.next(UserService._authenticatedUser);
  }

  get permissions() {
    return UserService._permissions;
  }

  /**
  * Load profile informations of loagged in user
  * @return Observer<User>
  */
  whoami(): Observable<User> {
    return this.http.get<User>('/api/whoami');
  }

  /**
  * Load user data for given ID
  * @param  userID number
  * @return        Observable<User>
  */
  whois(userID: number): Observable<User> {
    return this.http.get<User>('/api/whois/' + userID);
  }

  /**
   * Call logout API to destroy user session or token
   */
  logout(): Observable<any> {
    return this.http.get<any>('/api/logout');
  }

  index(page: number = 1, filters = {}): Observable<Pagination<User[]>> {
    if (page <= 0) {
      page = 1;
    }
    return this.http.get<Pagination<User[]>>('/api/admin/user/index?page=' + page + '&filters=' + JSON.stringify(filters));
  }

  getBasicInfo() {
    return this.http.get<any>('/api/admin/user/basic_info');
  }

  details(id: number): Observable<User> {
    return this.http.get<User>('/api/admin/user/' + id + '/details');
  }

  save(user: User): Observable<User> {
    if (user.id === undefined || user.id === 0) {
      return this.http.post<User>('/api/admin/user/save', user);
    } else {
      return this.http.post<User>('/api/admin/user/save/' + user.id, user);
    }
  }

  /**
   * بروز سانی پروفایل کاربر
   * @param user
   */
  updateProfile(user: User): Observable<User> {
    return this.http.post<User>('/api/v2/userarea/profile/update', user);
  }

  /**
  * Call API of updating password
  * @param  password   string      New password
  * @return Observer<User>
  */
  updatePassword(password: string, password_confirmation: string): Observable<any> {
    const payload = {
      password: password,
      password_confirmation: password_confirmation,
    };
    return this.http.post('/api/v2/userarea/profile/update_password', payload);
  }

  /**
   * Upload new avatar file
   * @param  avatarFile     File
   * @return                Observable<string>
   */
  updateAvatar(avatarBase64: string): Observable<User> {
    return this.http.post<User>('/api/v2/userarea/profile/update_avatar', {
      image_base64: avatarBase64,
    });
  }

  /**
   * دریافت اطلاعات پایه برای ویرایش پروفایل
   * @returns Observable<any>
   */
  getProfileBasicInfo(): Observable<any> {
    return this.http.get('/api/v2/userarea/profile/basic_info');
  }

  /**
  * Call API of updating username
  * @param  id         number      ID of user to update his username
  * @param  username   string      New username
  * @return Observer<User>
  */
  updateUsername(id: number, username: string): Observable<User> {
    const payload = {
      Username: username
    };
    return this.http.post<User>('/api/user/' + id + '/update_username', payload);
  }

  /**
  * Call API of updating email
  * @param  id         number      ID of user to update his email
  * @param  email   string      New email
  * @return Observer<User>
  */
  updateEmail(id: number, email: string): Observable<User> {
    const payload = {
      Email: email
    };
    return this.http.post<User>('/api/user/' + id + '/update_email', payload);
  }

  /**
   * Verify email of user
   * @param  token [description]
   * @return       [description]
   */
  verifyEmail(token: string) {
    return this.http.get('/api/signup/verify?token=' + token);
  }

  /**
   * Request for reset password link
   * @param  email string
   * @return       Observable<any>
   */
  passwordResetRequest(email: string) {
    const payload = {
      Email: email
    };
    return this.http.post<any>('/api/password_reset/request', payload);
  }

  /**
   * validate token of reset password
   * @return Observable<any>
   */
  validatePasswordResetLink(token: string): Observable<any> {
    return this.http.get<any>('/api/password_reset/validate?token=' + token);
  }

  resetPassword(reqModel: any): Observable<any> {
    return this.http.post<any>('/api/password_reset/do', reqModel);
  }
}
