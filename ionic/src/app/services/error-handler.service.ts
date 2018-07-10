import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorHandlerService {

  constructor() { }

  HandleResponseErrors(err: HttpErrorResponse): any {
    // console.log(err)
    switch (err.status) {
      case 404:
      case 406:
      case 422: {
        let r = err.error.errors;
        if (r == null) {
          r = {};
        }
        r.message = err.error.message;
        return r;
      }
      case 401: {
        let r = err.error.errors;
        if (r == null) {
          r = {};
        }
        r.message = err.error.message;
        window.location.href = '/#/signin';
        return r;
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
