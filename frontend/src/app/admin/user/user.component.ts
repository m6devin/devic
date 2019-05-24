import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/global/pagination/pagination-model';
import { User } from 'src/app/models/user';
import { FormElement } from 'src/app/global/search-form/form-element-model';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/global/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { IError } from 'src/app/models/error';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackerService } from 'src/app/services/snacker.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  pagination: Pagination<User[]> = new Pagination<User[]>();
  selectedID = 0;
  loading = true;
  filters: any = {};
  errors: IError = {};

  searchElements: FormElement[] = [
    new FormElement({
      name: 'name',
      placeholder: 'Name',
      type: 'text',
      label: 'Name',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
    }),
    new FormElement({
      name: 'username',
      placeholder: 'Username',
      type: 'text',
      label: 'Username',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
    }),
    new FormElement({
      name: 'email',
      placeholder: 'Email',
      type: 'text',
      label: 'Email',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
    }),
    new FormElement({
      name: 'mobile',
      placeholder: 'Phone Number',
      type: 'text',
      label: 'Phone Number',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
    }),
    new FormElement({
      name: 'enabled',
      placeholder: 'Status',
      type: 'boolean',
      label: 'Status',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      optionItems: [
        { label: 'All', value: '' },
        { label: 'Enabled', value: 1 },
        { label: 'Disabled', value: 0 },
      ],
    }),
    new FormElement({
      name: 'expired',
      placeholder: 'Expiration status',
      type: 'boolean',
      label: 'Expiration status',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      optionItems: [
        { label: 'All', value: '' },
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ],
    }),
    new FormElement({
      name: 'locked',
      placeholder: 'Locked',
      type: 'boolean',
      label: 'Locked',
      cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      optionItems: [
        { label: 'All', value: '' },
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ],
    }),
  ];

  constructor(private userService: UserService,
    public dialog: MatDialog,
    private errHandler: ErrorHandlerService,
    private snacker: SnackerService) { }

  ngOnInit() {
    this.getIndex(1);
  }

  getIndex(page: number, showLoading = true) {
    if (showLoading) {
      this.loading = true;
    }
    this.userService.index(page, this.filters).subscribe((res: any) => {
      this.loading = false;
      this.pagination = res;
    }, err => {
      this.handleHttpError(err);
    });
  }

  doSearch(e) {
    this.filters = e;
    this.getIndex(1);
  }

  handleHttpError(err: HttpErrorResponse) {
    this.loading = false;
    this.errors = this.errHandler.HandleResponseErrors(err);
    this.snacker.error(this.errors);
  }


}
