import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  flatErrors: string[] = [];

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private snackBarRef: MatSnackBarRef<any>) { }

  ngOnInit() {
    if (this.data.errors) {
      for (const key in this.data.errors) {
        if (!this.data.errors.hasOwnProperty(key)) {
          continue;
        }
        if (typeof this.data.errors[key] === 'object') {
          for (const k in this.data.errors[key]) {
            if (!this.data.errors[key].hasOwnProperty(k)) {
              continue;
            }
            this.flatErrors.push(this.data.errors[key][k]);
          }
        } else {
          this.flatErrors.push(this.data.errors[key]);
        }
      }
    }
  }
  close() {
    this.snackBarRef.dismiss();
  }

}

export class SnackbarData {
  constructor(
    public message?: string,
    public errors?: {},
    public actionText?: string,
  ) { }

}
