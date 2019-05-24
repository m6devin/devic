import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SnackerService } from 'src/app/services/snacker.service';

export class FileItem {
  id?: number;
  language_descriptions: any = {};
  mainFile?: File;
  thumbnail_base64?: string;
  sort_order: number;
  status: boolean;
  purchase_type: number;

  loadDefaults() {
    this.sort_order = 1;
    this.status = true;
    this.purchase_type = 1;
  }
}
@Component({
  selector: 'app-file-manager-form',
  templateUrl: './file-manager-form.component.html',
  styleUrls: ['./file-manager-form.component.scss'],
  providers: [ErrorHandlerService, SnackerService],
})
export class FileManagerFormComponent implements OnInit {
  /**
   * فایلی که در حال مدیریت در فرم است
   * در صورت عدم مقدار دهی از ورودی
   * به عنوان مورد جدید در نظر گرفته میشود
   */
  @Input() item: FileItem;

  /**
   * آدرس ای پی آی ایندکس
   * این آدرس بایست به کلمه کلیدی index ختم شود
   */
  @Input() indexRoute = '';

  /**
   * لیست زبان های مورد نیاز جهت رندر کردن فرم زبان ها
   */
  @Input() languages: any[] = [];

  /**
  * در هر شی از چه کلیدی برای بارگیری نام یا عنوان استفاده شود
  */
  @Input() nameKey = 'name';

  /**
   * در هر شی از چه کلیدی برای بارگیری توضیحات استفاده شود
   */
  @Input() descriptionKey = 'description';

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

  @Output() goBack: EventEmitter<any> = new EventEmitter();

  mediaFileChangedEvent: any = '';
  thumbnailImageChangedEvent: any = '';
  loading = false;
  errors: any = {};

  constructor(private http: HttpClient,
    private snacker: SnackerService,
    private errHandler: ErrorHandlerService) { }

  ngOnInit() {

    if (this.item === null || this.item === undefined) {
      this.item = new FileItem();
    }

    this.languageDescriptionsBindingDebugger();
    if (!this.item.id) {
      this.item.loadDefaults();
    }

  }

  languageDescriptionsBindingDebugger() {
    for (let l = 0; l < this.languages.length; l++) {
      const element = this.languages[l];
      if (this.item.language_descriptions === undefined) {
        this.item.language_descriptions = {};
      }
      const desc = this.item.language_descriptions['lang_' + element['id']];
      if (desc === undefined) {
        this.item.language_descriptions['lang_' + element['id']] = {};
      }
    }
  }

  back() {
    this.goBack.emit();
  }

  saveFile() {
    this.loading = true;
    if (this.item.id > 0 /** Update mode */) {
      this.http.post(this.getUpdateRoute(), this.item).subscribe(r => {
        this.snacker.success('بروز رسانی انجام شد.');
        this.uploadMainFile();
      }, err => {
        this.loading = false;
        this.errors = this.errHandler.HandleResponseErrors(err);
        this.snacker.error(this.errors);
      });
    } else {
      this.http.post(this.getInsertRoute(), this.item).subscribe((res: any) => {
        this.item.id = res.id;
        this.snacker.success('بروز رسانی انجام شد.');
        this.uploadMainFile();
      }, err => {
        this.loading = false;
        this.errors = this.errHandler.HandleResponseErrors(err);
        this.snacker.error(this.errors);
      });
    }

  }

  uploadMainFile() {
    if (this.item.mainFile === undefined || this.item.mainFile == null) {
      this.loading = false;
      return;
    }
    const infoSnack = this.snacker.info('درحال بارگذاری فایل. لطفا شکیبا باشید...', null, null);
    const formData = new FormData();
    formData.append('main_file', this.item.mainFile, this.item.mainFile.name);
    this.http.post(this.getMediaUploadRoute(), formData).subscribe(res => {
      infoSnack.dismiss();
      this.snacker.success('بارگذاری فایل با موفقیت انجام شد.');
      this.item.mainFile = null;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.errors = this.errHandler.HandleResponseErrors(err);
      infoSnack.dismiss();
      this.snacker.error(this.errors);
    });
  }

  getInsertRoute() {
    return this.indexRoute.replace('/index', '/save');
  }

  getUpdateRoute() {
    return this.indexRoute.replace('/index', '/save/' + this.item.id);
  }

  getMediaUploadRoute() {
    return this.indexRoute.replace('/index', '/media/' + this.item.id + '/upload_main_file');
  }

  /**
   * Handle image file change to reset cropper data
   */
  fileChangeEvent(event: any): void {
    this.item.mainFile = event.target.files[0];

    if (this.imageCropperEnabled === false) {
      this.mediaFileChangedEvent = undefined;
      return;
    }

    // تعیین نوع فایل
    // در صورت فایل عکسی
    // برش فعال شود
    const file: File = event.target.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      this.mediaFileChangedEvent = event;
      return;
    }

    this.mediaFileChangedEvent = undefined;
    return;
  }

  /**
   * Handle after crop event
   * @param event
   */
  imageCropped(event: ImageCroppedEvent) {
    this.item.mainFile = new File([event.file], 'main_file.png');
  }

  imageLoaded() {
  }

  loadImageFailed() {
  }

  /**
   * Handle image file change to reset cropper data
   */
  thumbnailFileChangeEvent(event: any): void {
    this.thumbnailImageChangedEvent = event;
  }

  /**
   * Handle after crop event
   * @param event
   */
  thumbnailImageCropped(event: ImageCroppedEvent) {
    this.item.thumbnail_base64 = event.base64;
  }

  thumbnailImageLoaded() {
  }
  thumbnailLoadImageFailed() {
  }
}
