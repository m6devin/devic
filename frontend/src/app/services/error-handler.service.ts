import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorHandlerService {

  constructor() { }

  HandleResponseErrors(err: HttpErrorResponse): any {
    switch (err.status) {
      case 404:
      case 403:
      case 406:
      case 422: {
        return err.error;
      }
      case 401: {
        window.location.href = './#/login';
        return err.error;
      }
      case 504: {
        alert(err.error);
        return err;
      }
      default:
        return {};
    }
  }
}
