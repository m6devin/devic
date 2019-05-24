import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent, SnackbarData } from '../global/snackbar/snackbar.component';
import { IError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class SnackerService {

  constructor(private snackBar: MatSnackBar) { }

  success(mgs: string, duration = 3000, buttonLabel = 'OK') {
    return this.snackBar.openFromComponent(SnackbarComponent, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snak-success'],
      duration: duration,
      data: new SnackbarData(mgs, null, buttonLabel),
    });
  }

  info(mgs: string, duration = 3000, buttonLabel = 'OK') {
    return this.snackBar.openFromComponent(SnackbarComponent, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snak-info'],
      duration: duration,
      data: new SnackbarData(mgs, null, buttonLabel),
    });
  }

  error(error: IError, duration = 3000, buttonLabel = 'OK') {
    return this.snackBar.openFromComponent(SnackbarComponent, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snak-error'],
      duration: duration,
      data: new SnackbarData(error.message, error.errors, buttonLabel),
    });
  }
}
