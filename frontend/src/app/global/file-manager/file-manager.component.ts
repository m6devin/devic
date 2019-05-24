import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../pagination/pagination-model';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
/**
 * این کامپوننت برای مدیریت فایل ها در هر فرمی است
 * به این صورت که ورودی این کامپوننت آدرس ای پی آی ایندکس داده میشود
 * و آدرس های درج و ویرایش و حذف بر اساس این آدرس ایجاد خواهد شد
 * این کامپوننت توانایی مدیریت فایل های تصویری و غیر تصویری را داراست
 */
export class FileManagerComponent implements OnInit {
  /**
   * آدرس ای پی آی ایندکس
   * این آدرس بایست به کلمه کلیدی index ختم شود
   */
  @Input() indexRoute = '';
  /**
   * فعال سازی دکمه حذف در کنار فایل
   */
  @Input() deletable = true;

  /**
   * داده های صفحه ایندکس دارای صفحه بندی است یا خیر
   */
  @Input() paginated = true;

  /**
   * در هر شی از چه کلیدی برای بارگیری نام یا عنوان استفاده شود
   */
  @Input() nameKey = 'name';

  /**
   * در هر شی از چه کلیدی برای بارگیری توضیحات استفاده شود
   */
  @Input() descriptionKey = 'description';

  /**
   * زبانهای مورد نیاز برای ساخت فرم زبان ها
   */
  @Input() languages: any[] = [];

  /**
   * فعال بودن برش تصویر در زمان انتخاب فایل عکس
   */
  @Input() imageCropperEnabled = true;

  /**
   * در صورت فعال بودن برش تصویر، نسبت طول و عرض برش را تعیین میکند
   */
  @Input() imageCropperRatio = (4 / 3);

  /**
   * نمایش تب تصویر بند انگشتی
   */
  @Input() thumbnailImageEnabled = true;

  /**
   * نسبت طول و عرض برش تصویر در تصویر انگشتی
   */
  @Input() thumbnailImageCropperRatio = (4 / 3);

  /**
   * در فرم مدیریت فایل گزینه های نوع نیاز به خرید را فعال و غیر فعال میکند
   */
  @Input() enablePurchaseType = true;

  insertRoute = '';
  updateRoute = '';
  deleteRoute = '';

  pageError = null;
  isLoading = true;
  showForm = false;

  selectedFile: any = null;
  pagination: Pagination<any[]> = new Pagination<any[]>();

  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.mapDialogDataToInputs();
    }
  }

  ngOnInit() {
    if (!this.hasValidConfig()) {
      return;
    }
    this.insertRoute = this.indexRoute.replace('index', 'new');
    this.getIndex(1);
  }
  mapDialogDataToInputs() {
      this.indexRoute = this.data.indexRoute != undefined ? this.data.indexRoute : this.indexRoute;
      this.deletable = this.data.deletable != undefined ? this.data.deletable : this.deletable;
      this.paginated = this.data.paginated != undefined ? this.data.paginated : this.paginated;
      this.nameKey = this.data.nameKey != undefined ? this.data.nameKey : this.nameKey;
      this.descriptionKey = this.data.descriptionKey != undefined ? this.data.descriptionKey : this.descriptionKey;
      this.languages = this.data.languages != undefined ? this.data.languages : this.languages;
      this.imageCropperEnabled = this.data.imageCropperEnabled != undefined ? this.data.imageCropperEnabled : this.imageCropperEnabled;
      this.imageCropperRatio = this.data.imageCropperRatio != undefined ? this.data.imageCropperRatio : this.imageCropperRatio;
      this.thumbnailImageEnabled = this.data.thumbnailImageEnabled != undefined ? this.data.thumbnailImageEnabled
        : this.thumbnailImageEnabled;
      this.thumbnailImageCropperRatio = this.data.thumbnailImageCropperRatio != undefined ? this.data.thumbnailImageCropperRatio
        : this.thumbnailImageCropperRatio;
      this.enablePurchaseType = this.data.enablePurchaseType != undefined ? this.data.enablePurchaseType : this.enablePurchaseType;
  }

  getIndex(page = 1) {
    if (this.paginated) {
      if (page <= 0) {
        page = 1;
      }
      let pageKey = '?page=';
      if (this.indexRoute.includes('?')) {
        pageKey = '&page=';
      }
      this.http.get<Pagination<any[]>>(this.indexRoute + pageKey + page).subscribe(res => {
        this.pagination = res;

        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      });
    } else {
      let pageKey = '?paginate=no';
      if (this.indexRoute.includes('?')) {
        pageKey = '&paginate=no';
      }
      this.http.get<any[]>(this.indexRoute + pageKey).subscribe(res => {
        this.pagination.data = res;
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      });
    }
  }

  hasValidConfig() {
    let hasValidConfig = true;

    if (!this.indexRoute.toString().split('?')[0].endsWith('/index')) {
      this.pageError = `<li>
  آدرس ایندکس صحیح نیست.
  <br/>
  این آدرس باید مانند مثال زیر به کلمه کلیدی
  <b>index</b>
  ختم شود.
  <br>
  <div dir="ltr">/api/somewhere/index</div>
  </li>`;
      hasValidConfig = false;
    }

    if (hasValidConfig === false) {
      this.pageError = `<h4>تنظیمات زیر برای فعال سازی ماژول الزامی است: </h4><ol>` + this.pageError + `</ol>`;
    }



    return hasValidConfig;
  }

  isImage(item: any) {
    if (item['thumbnail']) {
      return item['thumbnail'].endsWith('.jpg') ||
        item['thumbnail'].endsWith('.png') ||
        item['thumbnail'].endsWith('.jpeg') ||
        item['thumbnail'].endsWith('.gif');
    }

    if (item['filepath']) {
      return item['filepath'].endsWith('.jpg') ||
        item['filepath'].endsWith('.png') ||
        item['filepath'].endsWith('.jpeg') ||
        item['filepath'].endsWith('.gif');
    }

    return false;
  }

  isVideo(item: any) {
    if (!item['filepath']) {
      return false;
    }
    return item['filepath'].endsWith('.mp4') ||
      item['filepath'].endsWith('.webm') ||
      item['filepath'].endsWith('.oog');

  }

  isAudio(item: any) {
    if (!item['filepath']) {
      return false;
    }

    return item['filepath'].endsWith('.mp3') ||
      item['filepath'].endsWith('.wav') ||
      item['filepath'].endsWith('.oog');

  }

  showFormFunc(item: any = null) {
    this.showForm = true;
    this.selectedFile = item;
  }

  getStreamRoute(item: any) {
    return this.indexRoute.replace('/index', '/media/' + item.id + '/stream');
  }

}
