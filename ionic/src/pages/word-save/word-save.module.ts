import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WordSavePage } from './word-save';

@NgModule({
  declarations: [
    WordSavePage,
  ],
  imports: [
    IonicPageModule.forChild(WordSavePage),
  ],
})
export class WordSavePageModule {}
