import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SnackerService } from 'src/app/services/snacker.service';
import * as _ from 'lodash';
import { User } from 'src/app/models/user';
import { IError } from 'src/app/models/error';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [SnackerService, UserService],
})
export class UserFormComponent implements OnInit {

  loading = true;
  user: User;
  basicInfo: Object = {};
  errors: IError = {};
  imageChangedEvent: any = '';

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private errHandler: ErrorHandlerService,
    private snacker: SnackerService,
    public userService: UserService) { }


  ngOnInit() {
    const ID = this.activeRoute.snapshot.params['id'];

    this.userService.getBasicInfo().subscribe(res => {
      this.basicInfo = res;


      if (ID === undefined) {
        // Insert mode
        this.user = new User();
        this.user.loadDefaults();

        this.loading = false;
      } else {
        // Update mode
        this.userService.details(ID).subscribe((res2: User) => {
          this.user = res2;
          this.loading = false;
        }, err => {
          this.handleHttpError(err);
        });
      }

    }, err => {
      this.handleHttpError(err);
    });

  }

  saveUser() {
    this.userService.save(this.user).subscribe(res => {
      this.snacker.success('ذخیره سازی با موفقیت انجام شد.');
      this.user.image_base64 = null;
      this.user.image = res.image;
      if (!this.user.id || this.user.id <= 0) {
        this.router.navigate(['/admin/user', res.id, 'edit']);
      }
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
    this.user.image_base64 = event.base64;
  }

  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

}
