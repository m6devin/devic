import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { IError } from 'src/app/models/error';
import { UserService } from 'src/app/services/user.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackerService } from 'src/app/services/snacker.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  providers: [UserService],
})
export class UserProfileEditComponent implements OnInit {

  loading = false;
  user: any;
  basicInfo: any = {};
  errors: IError = {};

  imageChangedEvent: any = '';
  avatarCropped = false;
  avatarBase64: string;
  avatarPath: string;
  firstTimeLoad = true;

  @ViewChild('passForm') passForm: any;
  @ViewChild('avatarForm') avatarForm: any;

  constructor(private errHandler: ErrorHandlerService,
    private snacker: SnackerService,
    public userService: UserService) { }

  ngOnInit() {
    if (this.userService.authenticatedUser.id) {
      this.user = this.userService.authenticatedUser;
    } else {
      this.userService.authenticatedUserSubject.subscribe(data => {
        this.user = this.cloneUserData(data);
        this.avatarPath = data.avatar;
      });
    }
    // this.userService.getProfileBasicInfo().subscribe(bi => {
    //   this.basicInfo = bi;
    //   this.loading = false;
    // }, err => {
    //   this.handleHttpError(err);
    // });

  }

  cloneUserData(data: any) {
    this.avatarPath = data.avatar;
    return _.cloneDeep({ name: data.name, mobile: data.mobile });
  }

  updateProfile() {
    this.userService.updateProfile(this.user).subscribe(res => {
      this.snacker.success('پروفایل شما با موفقیت بروزرسانی شد.');
      this.userService.setAuthenticatedUserSubject(this.user);
    }, err => {
      this.handleHttpError(err);
    });
  }

  updatePassword() {
    this.userService.updatePassword(this.user.password, this.user.password_confirmation).subscribe(res => {
      this.snacker.success('پروفایل شما با موفقیت بروزرسانی شد.');
      this.passForm.reset();
    }, err => {
      this.handleHttpError(err);
    });
  }

  updateAvatar() {
    this.userService.updateAvatar(this.avatarBase64).subscribe(res => {
      this.firstTimeLoad = false;
      this.snacker.success('آواتار شما با موفقیت بروزرسانی شد.');
      this.avatarForm.reset();
      this.avatarCropped = false;
      this.userService.setAuthenticatedUserSubject(res);
    }, err => {
      this.handleHttpError(err);
    });
  }

  handleHttpError(err: HttpErrorResponse) {
    this.loading = false;
    this.errors = this.errHandler.HandleResponseErrors(err);
    this.snacker.error(this.errors);
  }

  /**
   * Handle image file change to reset cropper data
   */
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  /**
   * Handle after crop event
   * @param event
   */
  imageCropped(event: ImageCroppedEvent) {
    this.avatarBase64 = event.base64;
    this.avatarCropped = true;
  }

  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

}
