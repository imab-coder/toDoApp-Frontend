import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListContainerComponent } from './list-container/list-container.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ ListContainerComponent, FriendsListComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ ListContainerComponent, FriendsListComponent]
})
export class SharedModule { }
