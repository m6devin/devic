import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { UserComponent } from './admin/user/user.component';
import { UserFormComponent } from './admin/user/user-form/user-form.component';
import { UserProfileEditComponent } from './components/user-profile/user-profile-edit/user-profile-edit.component';
import { WordComponent } from './components/word/word.component';
import { WordTodayReviewComponent } from './components/word/word-today-review/word-today-review.component';
import { TranslateComponent } from './components/translate/translate.component';
import { WordFormComponent } from './components/word-form/word-form.component';


const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'admin',
    children: [
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'user/new',
        component: UserFormComponent,
      },
      {
        path: 'user/:id/edit',
        component: UserFormComponent,
      },
    ],
  },
  {
    path: 'userarea',
    children: [
      {
        path: 'profile/edit',
        component: UserProfileEditComponent,
      },
      {
        path: 'translate',
        component: TranslateComponent,
      },
      {
        path: 'word/today',
        component: WordTodayReviewComponent,
      },
      {
        path: 'word/index',
        component: WordComponent,
      },
      {
        path: 'word/:id/edit',
        component: WordFormComponent,
      },
    ],
  },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {useHash: true}
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class AppRoutingModule {
}
