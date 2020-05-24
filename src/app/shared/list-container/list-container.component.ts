import { Component, OnInit, Input, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.css']
})
export class ListContainerComponent implements OnInit {

  @Input() allLists: any = [];
  @Input() userMode: any;

  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();

  public authToken: string;
  public userId: string;
  public userName: string;
  public userInfo: any;
  public selectedListNameTemp: any;
  public selectedListName: string;
  public selectedListId: any;
  public listCreatorId: any;
  public allItems = [];
  public enteredListName = '';
  public listName: any;
  public enteredTaskName: any = '';
  public itemName: any;
  public enteredSubTaskName = '';
  public subItemName: any;
  public selectedItemId: any;

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService,
  ) { }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('fullName');
    this.userInfo = this.appService.getLocalStorage()

    this.getUpdatesFromUser()
  }

  public addList = () => {

    if (this.enteredListName === null || this.enteredListName === '' || this.enteredListName == undefined) {
      this.toastr.error("You must enter a value", "Error!");
    } else {
      this.listName = this.enteredListName;
      this.addListFunction()
      this.enteredListName = ''
    }

  } // end addList

  public addListFunction(): any {

    if (!this.listName) {
      this.toastr.warning("List Name is required", "Warning!");
    }
    else {
      let data = {
        listName: this.listName,
        listCreatorId: this.userId,
        listCreatorName: this.userName,
        listModifierId: this.userId,
        listModifierName: this.userName,
        listMode: this.userMode,
        authToken: this.authToken
      }
      this.appService.addList(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("List Added successfully", "Success");
          let notifyData = {
            message: `${data.listCreatorName} has added a List named as ${data.listName}`,
          }
          this.notifyUserAboutList(notifyData);
        } else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      }, (err) => {
        this.toastr.error("Failed to Add List, Some Error Occurred", "Error!");
      });
    }
  }//end addListFunction


  public getItemsOfList = (list) => {
    this.selectedListNameTemp = list.listName;
    this.selectedListId = list.listId;
    this.selectedListName = list.listMode;
    this.selectedListName = list.listName;
    this.listCreatorId = list.listCreatorId
    this.getAllItemFunction()
  }

  public getAllItemFunction = () => {

    this.allItems = [];
    if (this.selectedListId != null && this.authToken != null) {
      this.appService.getAllItems(this.selectedListId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.allItems = apiResponse.data;
          let itemsDone = this.allItems.filter(item => item.itemDone == 'yes');
        } else {
          this.toastr.info(apiResponse.message, "Update!");
          this.allItems.length = 0;
        }
      }, (err) => {
        this.toastr.error("Some Error Occurred", "Error!");
      });
    } else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['login']);

    }

  }//end getAllItemFunction

  public deleteListFunction = () => {
    if (!this.selectedListId) {
      this.toastr.warning('List Id is required', 'Warning!')
    } else {
      let data = {
        listId: this.selectedListId,
        authToken: this.authToken
      }
      this.appService.deleteList(data).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success('List Deleted Successfully', 'Success')

          let notifyData = {
            message: `${this.userName} has deleted a List named as ${this.selectedListName}`
          }
          this.notifyUserAboutList(notifyData);
          this.selectedListName = '';
        } else {
          this.toastr.error(apiResponse.message, 'Error!')
        }
      }, (err) => {
        this.toastr.error('Failed to Delete list, Some Error occured', 'Error!')
      })
    }
  }

  public addTask = () => {
    if (this.enteredTaskName === null || this.enteredTaskName === '' || this.enteredTaskName === undefined) {
      this.toastr.error('Enter Task Name', 'Error!')
    } else {
      this.itemName = this.enteredTaskName
      this.addItemFunction();
      this.enteredTaskName = '';
    }
  }

  public addItemFunction(hasValue?: Boolean, gotData?: any): any {
    if (!this.selectedListId) {
      this.toastr.warning("List Id is required", "Warning!");
    }
    else if (!this.itemName) {
      this.toastr.warning("Item Name is required", "Warning!");
    }
    else {
      let data: any = {}
      if (hasValue) {
        data = gotData
      } else {
        data = {
          listId: this.selectedListId,
          itemName: this.itemName,
          itemCreatorId: this.userId,
          itemCreatorName: this.userName,
          itemModifierId: this.userId,
          itemModifierName: this.userName,
          authToken: this.authToken
        }
      }
      this.appService.addItem(data).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Item Added Successfully", "Success");

          let saveItem: any = {
            listId: this.selectedListId,
            key: 'Item Add',
            authToken: this.authToken,
            itemId: apiResponse.data.itemId
          }

          this.addHistoryFunction(saveItem)
          this.getAllItemFunction();

          let notifyData = {
            message: `${this.userName} has added a item into list named as ${this.selectedListName}`,
            listId: this.selectedListId
          }

          this.notifyUserAboutList(notifyData);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      }, (err) => {
        this.toastr.error("Failed to Add Item, Some Error Occurred", "Error!");
      });
    }
  }//end addItemFunction

  public addHistoryFunction(data): any {
    this.appService.addHistory(data).subscribe((apiResponse) => {
    })
  }//end addHistoryFunction

  public getUpdatesFromUser = () => {
    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {
      if (data.listId != undefined && data.listId == this.selectedListId) {
        this.getAllItemFunction()
      }
    });
  }//end getUpdatesFromUser


  public addSubTask = () => {
    if (this.enteredSubTaskName === null || this.enteredSubTaskName === '' || this.enteredSubTaskName == undefined) {
      this.toastr.error("You must enter a value", "Error!");
    } else {
      this.subItemName = this.enteredSubTaskName
      this.addSubItemFunction();
      this.enteredSubTaskName = ''
    }
  }


  public addSubItemFunction(hasValue?: Boolean, gotData?: any): any {

    let data: any = {}
    if (hasValue) {
      data.itemId = this.selectedItemId
      data.subItemId = gotData.subItemId
      data.subItemName = gotData.subItemName
      data.subItemCreatorId = gotData.subItemCreatorId
      data.subItemCreatorName = gotData.subItemCreatorName
      data.subItemModifierId = this.userId
      data.subItemModifierName = this.userName
    } else {
      data = {
        itemId: this.selectedItemId,
        subItemName: this.subItemName,
        subItemCreatorId: this.userId,
        subItemCreatorName: this.userName,
        subItemModifierId: this.userId,
        subItemModifierName: this.userName,
        authToken: this.authToken
      }
    }
    this.appService.addSubItem(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.success("Sub Item Added Successfully", "Success");

        if (!hasValue) {
          let saveItem: any = {
            listId: this.selectedListId,
            key: 'Sub Item Add',
            authToken: this.authToken,
            itemId: this.selectedItemId,
            subItemId: apiResponse.data.subItemId
          }
          this.addHistoryFunction(saveItem)
        }
        this.getAllItemFunction();

        let notifyData = {
          message: `${this.userName} has added a sub item into list named as ${this.selectedListName}`,
          listId: this.selectedListId
        }
        this.notifyUserAboutList(notifyData);
      } else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    }, (err) => {
      this.toastr.error("Failed to add Sub Item, Some Error Occurred", "Error!");
    });
  }//end addSubItemFunction

  public markAsDoneUndone: any = (itemId, itemName, itemDone) => {
    this.updateItemFunction(false, null, itemId, itemName, itemDone)
  } // end markAsDoneUndone


  public updateItemFunction(hasValue?: Boolean, gotData?: any, itemId?: any, itemName?: any, itemDone?: any): any {

    let data: any = {}
    if (hasValue) {
      data = gotData
    } else {
      data = {
        itemId: itemId,
        itemName: itemName,
        itemModifierId: this.userId,
        itemModifierName: this.userName,
        itemDone: itemDone,
        authToken: this.authToken
      }

      let saveItem: any = {
        listId: this.selectedListId,
        key: 'Item Update',
        authToken: this.authToken,
        itemId: itemId
      }
      this.addHistoryFunction(saveItem)
    }
    // data.authToken = this.authToken
    this.appService.updateItem(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.success("Item Updated", "Success");
        this.getAllItemFunction();

        let notifyData = {
          message: `${this.userName} has updated a item from list named as ${this.selectedListName}`,
          listId: this.selectedListId
        }
        this.notifyUserAboutList(notifyData);
      } else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    }, (err) => {
      this.toastr.error("Failed to update Item, Some Error Occurred", "Error!");
    });
  }//end updateItemFunction


  public deleteItemFunction(itemId, instructionFromHistory?: Boolean): any {

    if (!itemId) {
      this.toastr.warning("Item Id is required", "Warning!");
    } else {
      if (!instructionFromHistory) {
        let saveItem: any = {
          listId: this.selectedListId,
          key: 'Item Delete',
          authToken: this.authToken,
          itemId: itemId
        }
        this.addHistoryFunction(saveItem)
      }

      let data = {
        itemId: itemId,
        authToken: this.authToken
      }

      this.appService.deleteItem(data).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Item Deleted", "Success");
          this.getAllItemFunction();

          let notifyData = {
            message: `${this.userName} has deleted a item from list named as ${this.selectedListName}`,
            listId: this.selectedListId
          }
          this.notifyUserAboutList(notifyData);
        } else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      }, (err) => {
        this.toastr.error("Failed to Delete Item, Some Error Occurred", "Error!");
      });
    }
  }//end deleteItemFunction

  public deleteSubItemFunction(itemId, subItemId, instructionFromHistory?: Boolean): any {

    if (!itemId) {
      this.toastr.warning("Sub Item Id is required", "Warning!");
    } else if (!subItemId) {
      this.toastr.warning("Sub Item Id is required", "Warning!");
    } else {
      let data = {
        itemId: itemId,
        subItemId: subItemId,
        authToken: this.authToken
      }
      if (!instructionFromHistory) {
        let saveItem: any = {
          listId: this.selectedListId,
          key: 'Sub Item Delete',
          authToken: this.authToken,
          itemId: itemId,
          subItemId: subItemId
        }
        this.addHistoryFunction(saveItem)
      }

      this.appService.deleteSubItem(data).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Sub Item Deleted", "Success");
          this.getAllItemFunction();

          let notifyData = {
            message: `${this.userName} has deleted a sub item from list named as ${this.selectedListName}`,
            listId: this.selectedListId
          }
          this.notifyUserAboutList(notifyData);
        } else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      }, (err) => {
        this.toastr.error("Failed to Delete Sub Item, Some Error Occurred", "Error!");
      });
    }
  }//end deleteSubItemFunction


  public notifyUserAboutList(data) {
    this.notify.emit(data);
  }

}
