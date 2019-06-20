import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-google-translator-render',
  templateUrl: './google-translator-render.component.html',
  styleUrls: ['./google-translator-render.component.scss']
})
export class GoogleTranslatorRenderComponent implements OnInit {
  @Input() translationData: any = null;

  @Output() entryRowSelect: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  getEntryRowClicked(partOfSpeech: string, entry: any) {
    this.entryRowSelect.emit({
      part_of_speech: partOfSpeech,
      entry: entry,
    });
  }

}
