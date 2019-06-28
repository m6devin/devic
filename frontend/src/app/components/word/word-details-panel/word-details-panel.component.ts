import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-word-details-panel',
  templateUrl: './word-details-panel.component.html',
  styleUrls: ['./word-details-panel.component.scss']
})
export class WordDetailsPanelComponent implements OnInit {

  @Input() word: any;
  @Output() gotoWord: EventEmitter<string> = new EventEmitter();
  @Output() closePanel: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
