import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from './pagination-model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: Pagination<any>;
  @Input() pagesToRender = 4;
  @Output() gotopage: EventEmitter<number> = new EventEmitter();

  public pages: Array<any> = [];

  constructor() { }

  ngOnInit() {
  }

  get paginationData(): any {
    this.pages = [];
    if (this.pagination) {
      this.pagesToRender = Math.min(this.pagesToRender , this.pagination.last_page);
      const f = Math.max(this.pagination.current_page - 2 , 1);
      const l = Math.min(this.pagination.last_page , this.pagination.current_page + 2);

      if (f > 1) {
        this.pages.push('...');

      }

      for (let i = f; i <= l; i++) {
        this.pages.push(i);
      }

      if (l < this.pagination.last_page) {
        this.pages.push('...');

      }

    }
    return this.pagination;
  }

  changePage(page: number) {
    if (page > this.pagination.last_page || page < 1) {
      return;
    }
    this.gotopage.emit(page);
  }

}
