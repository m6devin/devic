import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormElement } from './form-element-model';
import { DatePickerComponent } from 'ng2-jalali-date-picker';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Input() elements: FormElement[] = [];

  /**
   * رشته جیسون ارسال شده را در فرم بارگیری میکند
   */
  @Input() filterJson = {};

  @Output() updateFilters: EventEmitter<any> = new EventEmitter();
  @Output() doSearch: EventEmitter<any> = new EventEmitter();
  @ViewChild('dayPicker') datePicker: DatePickerComponent;

  filtersObject: any = {};
  /**
   * مقادیر سرچ شده برای هر المنت
   */
  filterValues: any = {};
  /**
   * اپراتور هایی که برای هر المنت جهت سرچ انتخاب شده
   */
  filterOperators = {};

  /**
   * لیست اپراتور های مجاز
   */
  operators = [
    '=',
    '>=',
    '>',
    '<=',
    '<',
    'LIKE'
  ];

  constructor() {

  }

  ngOnInit() {
     // tslint:disable-next-line:forin
     for (const key in this.filterJson) {
      this.filterValues[key] = this.filterJson[key].value;
      this.filterOperators[key] = this.filterJson[key].operator;
    }
  }

  /**
   * داده های ثبت شده رد فرم جستجو را به فرم آرایه ای جهت سرچ تبدیل میکند
   */
  updateFiltersData() {
    this.filtersObject = {};
    // tslint:disable-next-line:forin
    for (const key in this.filterValues) {
      if (this.filtersObject[key] === undefined) {
        this.filtersObject[key] = {};
      }
      this.filtersObject[key].value = this.filterValues[key];
    }
    // tslint:disable-next-line:forin
    for (const key in this.filterOperators) {
      if (this.filtersObject[key] === undefined) {
        this.filtersObject[key] = {};
      }
      this.filtersObject[key].operator = this.filterOperators[key];
    }

    this.updateFilters.emit(this.filtersObject);

    return;
  }

  /**
   * Output an event for searching when search button clicked
   */
  doSearchHandler() {
    this.doSearch.emit(this.filtersObject);
  }

  /**
   * Clearing search form
   */
  clearForm() {

  }

  selectedCountry: any = null;
  selectedProvince: any = null;
  countryChanged() {
    this.filterValues.country_id = this.selectedCountry ? this.selectedCountry.id : null;
    if (this.filterValues.country_id == null) {
      this.filterValues.province_id = null;
      this.filterValues.city_id = null;
    }
    this.updateFiltersData();
  }
  provinceChanged() {
    this.filterValues.province_id = this.selectedProvince ? this.selectedProvince.id : null;
    if (this.filterValues.province_id == null) {
      this.selectedProvince = null;
      this.filterValues.city_id = null;
    }
    this.updateFiltersData();
  }

  // شی به صورت داینامیک داده های زمان های جلالی را ذخیره میکند که برای سرچ تبدیل شوند
  jdates: any = {};
  setDateFor(event, inputName: string) {
    if (!event) {
      this.filterValues[inputName] = null;
    } else {
      this.filterValues[inputName] = event.doAsGregorian().format('YYYY-MM-DD HH:mm:ss');
    }

    this.updateFiltersData();
  }

  clearData(name: string) {
    if (name in this.filterValues) {
      this.filterValues[name] = null;
    }
    if (name in this.jdates) {
      this.jdates[name] = null;
    }
  }
}

interface FilterElement {
  name: string;
  value: any;
  operator: string;
}
