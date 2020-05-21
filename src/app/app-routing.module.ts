import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user-management/login/login.component';
import { SignupComponent } from './user-management/signup/signup.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { MultiUserComponent } from './multi-user/multi-user.component';
import { FriendsComponent } from './friends/friends.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, pathMatch: 'full'},
  { path: 'signup', component: SignupComponent },
  { path: 'single-user', component: SingleUserComponent},
  { path: 'multi-user', component: MultiUserComponent },
  { path: 'friends', component: FriendsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
