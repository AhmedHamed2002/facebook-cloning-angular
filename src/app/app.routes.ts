import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './auth.guard';
import { FriendsPostComponent } from './friends-post/friends-post.component';
import { UserListComponent } from './user-list/user-list.component';
import { ViewUserProfileComponent } from './view-user-profile/view-user-profile.component';
import { AddPostComponent } from './add-post/add-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { MyFriendsComponent } from './my-friends/my-friends.component';
import { ViewReactionsComponent } from './view-reactions/view-reactions.component';
import { ViewCommentsComponent } from './view-comments/view-comments.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'myfriends', component: MyFriendsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'friends_post', component: FriendsPostComponent, canActivate: [AuthGuard]} ,
  { path: 'add_post' , component: AddPostComponent, canActivate: [AuthGuard] },
  { path: 'edit_post/:id', component: EditPostComponent, canActivate: [AuthGuard] },
  { path: 'user_list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'user_profile/:id', component: ViewUserProfileComponent, canActivate: [AuthGuard] },
  { path: 'view_reactions/:id', component: ViewReactionsComponent, canActivate: [AuthGuard] },
  { path: 'view_comments/:id', component: ViewCommentsComponent, canActivate: [AuthGuard] },
  { path: '404',  component: NotfoundComponent} ,
  { path: '**', redirectTo: '/404' }
];
