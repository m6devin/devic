import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-google-translator-render',
  templateUrl: './google-translator-render.component.html',
  styleUrls: ['./google-translator-render.component.scss']
})
export class GoogleTranslatorRenderComponent implements OnInit {
  @Input() translationData: any = null;
  @Input() word: string;

  @Output() entryRowSelect: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  getEntryRowClicked(partOfSpeech: string, entry: any) {
    if (!entry.reverse_translation) {
      entry.reverse_translation = [];
    }
    if (! entry.word) {
      entry = {
        word: entry.trans.split('،').join('\n'),
        reverse_translation: [],
      };
    }
    entry.reverse_translation = this.normalizedSynonyms(entry.reverse_translation);
    this.entryRowSelect.emit({
      part_of_speech: partOfSpeech,
      entry: entry,
    });
  }

  normalizedSynonyms(translations: any) {
    const arr =  _.remove(_.cloneDeep(translations), item => {
      return this.word != item;
    });

    return arr;
  }

}
