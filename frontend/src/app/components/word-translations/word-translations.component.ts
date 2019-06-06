import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/global/confirm-dialog/confirm-dialog.component';
import { TranslateService } from 'src/app/services/translate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IError } from 'src/app/models/error';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackerService } from 'src/app/services/snacker.service';
import * as  _ from 'lodash';

@Component({
  selector: 'app-word-translations',
  templateUrl: './word-translations.component.html',
  styleUrls: ['./word-translations.component.scss'],
  providers: [ErrorHandlerService, TranslateService]
})
export class WordTranslationsComponent implements OnInit {
  @Input() word;
  @Output() editTranslation: EventEmitter<any> = new EventEmitter();

  loading = false;
  errors: IError = {};

  constructor(public dialog: MatDialog, 
    private translateService: TranslateService,
    private errHandler: ErrorHandlerService,
    private snacker: SnackerService) { }

  ngOnInit() {
  }

  handleHttpError(err: HttpErrorResponse) {
    this.loading = false;
    this.errors = this.errHandler.HandleResponseErrors(err);
    this.snacker.error(this.errors);
  }

  delete(translation: any) {
    const dialogRef = this.showDeleteConfirmation();

    dialogRef.afterClosed().subscribe(result => {
      if (result == false) {
        return;
      }
      this.loading = true;
      this.translateService.deleteTranslation(translation.id).subscribe(res => {
        this.loading = false;
        this.removeTranslationFromArray(translation);
        this.snacker.success(res.message);
      }, err => {
        this.handleHttpError(err);
      });
    });
  }

  showDeleteConfirmation() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure to delete the translation?',
        confirmText: 'Yes, Delete it.',
        cancelText: 'Cancel',
      },
      direction: 'ltr',
    });
  }

  removeTranslationFromArray(translation: any) {
    const index = _.findIndex(this.word.translations, (item: any) => {
      return item.id == translation.id;
    });

    if (index == -1) {
      return;
    }

    this.word.translations.splice(index, 1);
  }
}
