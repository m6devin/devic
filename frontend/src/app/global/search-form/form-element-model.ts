export class FormElement {
  constructor(options: Object = null) {
    if (options == null) {
      return;
    }
    // tslint:disable-next-line:forin
    for (const i in options) {
      this[i] = options[i];
    }

  }

  label: string = null;
  placeholder: string = null;
  name: string = null;
  type: string = null;
  value: any = null;
  optionItems: Array<{label: string, value: any}> = [];
  cssClass: string = null;
}
