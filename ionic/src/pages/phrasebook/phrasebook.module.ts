import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhrasebookPage } from './phrasebook';

@NgModule({
  declarations: [
    PhrasebookPage,
  ],
  imports: [
    IonicPageModule.forChild(PhrasebookPage),
  ],
})
export class PhrasebookPageModule {}
