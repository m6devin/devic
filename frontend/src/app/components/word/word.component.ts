import { Component, OnInit, Input } from '@angular/core';
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
import * as _ from 'lodash';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {

  @Input() showSearch = true;
  @Input() todayReview = false;
  page = 1;
  filters: any = {
  };
  loading: boolean;
  errors: IError = {};
  searchElements: FormElement[];
  pagination: Pagination<any[]> = new Pagination<any[]>();
  basicInfo: any = {};
  selectedWord: any = null;

  constructor(private wordService: WordService,
    public dialog: MatDialog,
    private errHandler: ErrorHandlerService,
    private snacker: SnackerService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    if (this.todayReview == true) {
      this.filters = { today_review: { value: 1 } };
    }
    this.loadFiltersFormQueryParams();
    this.getList(this.page);
    this.wordService.getBasicInfo().subscribe(infoRes => {
      this.basicInfo = infoRes;
      this.initSearchForm();
    });
  }

  loadFiltersFormQueryParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['lfs'] == 'true') {
        const ps = JSON.parse(localStorage.getItem('word_query_params'));
        this.page = ps && parseInt(ps['page'], 10) > 0 ? parseInt(ps['page'], 10) : 1;
        try {
          this.filters = JSON.parse(ps['filters']);
        } catch (e) { }

      } else {
        this.page = parseInt(params['page'], 10) > 0 ? parseInt(params['page'], 10) : 1;
        try {
          this.filters = JSON.parse(params['filters']);
        } catch (e) { }
      }
    });
  }

  handleHttpError(err: HttpErrorResponse) {
    this.loading = false;
    this.errors = this.errHandler.HandleResponseErrors(err);
    this.snacker.error(this.errors);
  }


  getList(page: number, onSuccess: any = () => {} ) {
    const params = { filters: JSON.stringify(this.filters), page: page };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
    localStorage.setItem('word_query_params', JSON.stringify(params));
    this.loading = true;
    this.wordService.myWordsIndex(page, this.filters).subscribe(res => {
      this.loading = false;
      this.pagination = res;
      if (onSuccess) {
        onSuccess();
      }
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
        name: 'today_review',
        placeholder: 'Today Review Only',
        type: 'boolean',
        label: 'Today Review Only',
        cssClass: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
        optionItems: [
          { label: 'Yes', value: 1 },
          { label: 'No', value: 0 },
        ],
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
    if (word.reviews == undefined || word.reviews == null || word.reviews.length == 0) {
      return false;
    }
    const createdAt = word.reviews[0].created_at;
    const diff = moment().diff(createdAt);

    if ((diff / 1000) < (1 * 60)) {
      return true;
    }

    return false;
  }

  deleteWord(wordID: number) {
    const dialogRef = this.showDeleteConfirmation();

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) {
        return;
      }
      this.loading = true;
      this.wordService.deleteWord(wordID).subscribe(res => {
        this.loading = false;
        this.removeWordFromArray(wordID);
        this.snacker.success(res.message);
      }, err => {
        this.handleHttpError(err);
      });
    });
  }

  showDeleteConfirmation() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure to delete the word?',
        confirmText: 'Yes, Delete it.',
        cancelText: 'Cancel',
      },
      direction: 'ltr',
    });
  }

  removeWordFromArray(wordID: number) {
    const index = _.findIndex(this.pagination.data, (item: any) => {
      return item.id == wordID;
    });

    if (index == -1) {
      return;
    }

    this.pagination.data.splice(index, 1);
  }

  gotoWord(dir: string) {
    if (! this.selectedWord) {
      return;
    }
    const index = _.findIndex(this.pagination.data, (w: any) => {
      return this.selectedWord.id == w.id;
    });

    if (index == -1) {
      return;
    }
    switch (dir) {
      case 'next': {
        this.gotoNextWord(index);
        break;
      }

      case 'previous': {
        this.gotoPreviousWord(index);
        break;
      }
    }
  }

  private gotoNextWord(currentIndex: number) {
    const wordsCount = this.pagination.data.length;
    if (currentIndex < (wordsCount - 1)) {
      this.selectedWord = this.pagination.data[currentIndex + 1];
      return;
    }
    if (this.page == this.pagination.last_page) {
      this.snacker.info('No more words exist!');
      return;
    }
    this.page++;
    this.getList(this.page, () => {
      this.selectedWord = this.pagination.data[0];
    });
  }

  private gotoPreviousWord(currentIndex: number) {
    if (currentIndex > 0) {
      this.selectedWord = this.pagination.data[currentIndex - 1];
      return;
    }
    if (this.page == 1 && currentIndex == 0) {
      this.snacker.info('This is the first word!');
      return;
    }
    this.page--;
    this.getList(this.page, () => {
      const wordsCount = this.pagination.data.length;
      this.selectedWord = this.pagination.data[wordsCount - 1];
    });
  }


}
