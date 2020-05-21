import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserManagementModule } from './user-management/user-management.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { SingleUserComponent } from './single-user/single-user.component';
import { MultiUserComponent } from './multi-user/multi-user.component';
import { FriendsComponent } from './friends/friends.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    SingleUserComponent,
    MultiUserComponent,
    FriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserManagementModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      enableHtml: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
