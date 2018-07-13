import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WordDetailsPage } from './word-details';

@NgModule({
  declarations: [
    WordDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(WordDetailsPage),
  ],
})
export class WordDetailsPageModule {}
