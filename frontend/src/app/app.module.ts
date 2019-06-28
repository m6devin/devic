import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoadingComponent } from './global/loading/loading.component';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { PaginationComponent } from './global/pagination/pagination.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';

import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

/**
 * FontAwesome imports
 */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faCoffee, faShoppingCart, faCircle, faLaptop, faLock, faBars } from '@fortawesome/free-solid-svg-icons';
import { far, faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import { fab, faTelegram, faTwitter, faGithub, faLinkedin, faStackOverflow } from '@fortawesome/free-brands-svg-icons';

import { LoginComponent } from './user/login/login.component';
import { JdatePipe } from './pips/jdate.pipe';
import { SearchFormComponent } from './global/search-form/search-form.component';
import { ConfirmDialogComponent } from './global/confirm-dialog/confirm-dialog.component';
import { SnackbarComponent } from './global/snackbar/snackbar.component';
import { FileManagerComponent } from './global/file-manager/file-manager.component';
import { FileManagerFormComponent } from './global/file-manager/file-manager-form/file-manager-form.component';
import { GraphQLModule } from './graphql.module';
import { UserComponent } from './admin/user/user.component';
import { UserFormComponent } from './admin/user/user-form/user-form.component';
import { UserProfileEditComponent } from './components/user-profile/user-profile-edit/user-profile-edit.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { WordComponent } from './components/word/word.component';
import { WordTodayReviewComponent } from './components/word/word-today-review/word-today-review.component';
import { TranslateComponent } from './components/translate/translate.component';
import { WordTranslationsComponent } from './components/word-translations/word-translations.component';
import { WordTranslationFormComponent } from './components/word-translation-form/word-translation-form.component';
import { WordFormComponent } from './components/word-form/word-form.component';
import { GoogleTranslatorRenderComponent } from './components/google-translator-render/google-translator-render.component';
import { WordDetailsPanelComponent } from './components/word/word-details-panel/word-details-panel.component';
library.add(fas, fab, far, faCoffee, faShoppingCart, faCircle, faLaptop, faLock, faBars,
  faTelegram, faTwitter, faGithub, faLinkedin, faStackOverflow, faBell, faUser);

@NgModule({
  declarations: [
    LoadingComponent,
    PaginationComponent,
    AppComponent,
    DashboardComponent,
    LoginComponent,
    JdatePipe,
    PaginationComponent,
    SearchFormComponent,
    ConfirmDialogComponent,
    SnackbarComponent,
    FileManagerComponent,
    FileManagerFormComponent,
    UserComponent,
    UserFormComponent,
    UserProfileEditComponent,
    WordComponent,
    WordTodayReviewComponent,
    TranslateComponent,
    WordTranslationsComponent,
    WordTranslationFormComponent,
    WordFormComponent,
    GoogleTranslatorRenderComponent,
    WordDetailsPanelComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    SnackbarComponent,
    FileManagerComponent,
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,

    NgbModule,
    ImageCropperModule,
    DpDatePickerModule,

    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatRadioModule,
    MatBottomSheetModule,
    GraphQLModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
