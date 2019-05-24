import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnChanges {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  @Input() isLoading: boolean;
  @Input() ratio = 3;
  @Input() fullscreen = true;

  zindex = 2020;
  display = 'block';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(chs: SimpleChanges) {
      if (chs['isLoading'] === undefined) {
          return;
      }

      if (chs.isLoading.currentValue === true) {
          this.show();
      } else {
          setTimeout(() => {
              this.hide();
          }, 1000);
      }
  }

  get position() {
      return this.fullscreen === true ? 'fixed' : 'absolute';
  }

  show() {
      this.display = 'block';
      this.zindex = 2020;
  }

  hide() {
      this.display = 'none';
      this.zindex = -1;
  }
}
