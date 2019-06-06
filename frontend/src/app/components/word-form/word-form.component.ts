import { Component, OnInit } from '@angular/core';
import { IError } from 'src/app/models/error';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackerService } from 'src/app/services/snacker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WordService } from 'src/app/services/word.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Word } from 'src/app/models/word';
import * as _ from 'lodash';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss'],
  providers: [WordService],
})
export class WordFormComponent implements OnInit {

  loading = true;
  errors: IError = {};
  basicInfo: any = {};
  word: Word;
  finalWordModel: any;
  sourcePage = 'translate';

  constructor(
    private errHandler: ErrorHandlerService,
    private snacker: SnackerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private wordService: WordService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.getBasicInfo(params['id']);
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.setSourcePage(params['from_page']);
    });
  }

  handleHttpError(err: HttpErrorResponse) {
    this.loading = false;
    this.errors = this.errHandler.HandleResponseErrors(err);
    this.snacker.error(this.errors);
  }

  getBasicInfo(wordID) {
    this.wordService.getBasicInfo(wordID).subscribe(res => {
      this.basicInfo = res;
      this.word = res.word;
      this.finalWordModel = _.cloneDeep(res.word);
      this.loading = false;
    });
  }

  setSourcePage(page = null) {
    if (!page) {
      return;
    }
    this.sourcePage = 'word_index';
  }

  save() {
    this.loading = true;
    this.wordService.saveWord(this.word).subscribe(res => {
      this.loading = false;
      this.snacker.success('Word saved successfully.');
      this.finalWordModel = _.cloneDeep(res);

    }, err => {
      this.handleHttpError(err);
    });
  }

  goBack() {
    switch (this.sourcePage) {
      case 'translate': {
        this.navigateToTranslate();
        break;
      }
      case 'word_index': {
        this.navigateToWordIndex();
        break;
      }
      default: {
        this.navigateToTranslate();
        break;
      }
    }
  }

  navigateToTranslate() {
    const params = {
      word: this.finalWordModel.word,
      from_language: this.finalWordModel.language_alpha2code,
    };

    this.router.navigate(['/userarea/translate'], {
      queryParams: params,
    });
  }

  navigateToWordIndex() {
    const params = {
    };

    this.router.navigate(['/userarea/word/index'], {
      queryParams: params,
    });
  }
}
