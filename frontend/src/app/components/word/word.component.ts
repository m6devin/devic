import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/global/pagination/pagination-model';
import { FormElement } from 'src/app/global/search-form/form-element-model';
import { WordService } from 'src/app/services/word.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/global/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { IError } from 'src/app/models/error';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackerService } from 'src/app/services/snacker.service';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {

  page = 1;
  filters: any = {};
  loading = true;
  errors: IError = {};
  searchElements: FormElement[];
  pagination: Pagination<any[]> = new Pagination<any[]>();
  basicInfo: any = {};

  constructor(private wordService: WordService,
    public dialog: MatDialog,
    private errHandler: ErrorHandlerService,
    private snacker: SnackerService) { }

  ngOnInit() {
    this.wordService.getBasicInfo().subscribe(infoRes => {
      this.basicInfo = infoRes;
      this.initSearchForm();
    });
    this.getList(this.page);
  }

  handleHttpError(err: HttpErrorResponse) {
    this.loading = false;
    this.errors = this.errHandler.HandleResponseErrors(err);
    this.snacker.error(this.errors);
  }


  getList(page: number) {
    this.wordService.myWordsIndex(page, this.filters).subscribe(res => {
      this.loading = false;
      this.pagination = res;
    }, err => {
      this.handleHttpError(err);
    });
  }

  initSearchForm() {
    this.searchElements = [
      new FormElement({
        name: 'word',
        placeholder: 'Word',
        type: 'text',
        label: 'Word',
        cssClass: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
      }),
      new FormElement({
        name: 'language_alpha2code',
        placeholder: 'Language',
        type: 'select',
        label: 'Language',
        cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
        optionItems: this.basicInfo.languages,
      }),
      new FormElement({
        name: 'archived',
        placeholder: 'Archived',
        type: 'boolean',
        label: 'Archived',
        cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
        optionItems: [
          { label: 'All', value: '' },
          { label: 'Yes', value: 1 },
          { label: 'No', value: 0 },
        ],
      }),
    ];
  }

  doSearch(e) {
    this.filters = e;
    this.getList(1);
  }

  recentlyReviewd(word: any): boolean {
    if(word.reviews == undefined || word.reviews == null || word.reviews.length == 0) {
      return false;
    }
    const createdAt = word.reviews[0].created_at;
    const diff = moment().diff(createdAt);

    if ((diff/1000) < (1 * 60)) {
      return true;
    }

    return false;
  }
}
