import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    if (this.data == null) {
      this.data = new ConfirmDialogData();
    }
  }

  ngOnInit() {
  }

}

export class ConfirmDialogData {
  constructor(
    public message: string = null,
    public description: string = null,
    public confirmText: string = null,
    public cancelText: string = null,
  ) {
    if (this.message == null) {
      this.message = 'آیا از این کار اطمینان دارید؟';
    }

    if (this.confirmText == null) {
      this.confirmText = 'بلی';
    }

    if (this.cancelText == null) {
      this.cancelText = 'خیر';
    }
  }

}
