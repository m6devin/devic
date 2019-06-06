import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-word-translations',
  templateUrl: './word-translations.component.html',
  styleUrls: ['./word-translations.component.scss']
})
export class WordTranslationsComponent implements OnInit {
  @Input() word;
  @Output() editTranslation: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
