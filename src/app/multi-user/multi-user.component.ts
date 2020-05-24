import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-multi-user',
  templateUrl: './multi-user.component.html',
  styleUrls: ['./multi-user.component.css']
})
export class MultiUserComponent implements OnInit {

  public fullName: string;
  public authToken: string;
  public userId: string;
  public userInfo: any;
  public userFriendsTemp = [];
  public userFriends = [];
  public allLists = [];

  constructor(
    public appService: AppService,
    public router: Router,
    public toastr: ToastrService,
    public socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.fullName = Cookie.get('fullName')
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userInfo = this.appService.getLocalStorage()
    this.userFriendsTemp.push(this.userId)

    for (let x of this.userInfo.friends) {
      this.userFriendsTemp.push(x.friendId)
      this.userFriends.push(x.friendId)
    }
    this.verifyUserConfirmation()

    this.getUpdatesFromUser()

    this.getAllPublicListFunction(this.userFriendsTemp)

  }


  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);
      }, (err) => {
        this.toastr.error(err, "Some error occured");
      })
  }//end verifyUserConfirmation


  public getUpdatesFromUser = () => {

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {
      this.toastr.info(data.message);
      if (!data.listId) {
        this.getAllPublicListFunction(this.userFriendsTemp)
      }
    });
  }//end getUpdatesFromUser



  public getAllPublicListFunction = (userIds) => {
    //this function will get all the public lists of User. 
    this.allLists = []
    if (this.authToken != null) {
      this.appService.getAllPublicList(userIds, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          for (let apiItem of apiResponse.data) {
            this.allLists.push(apiItem)
          }
        } else {
          this.toastr.info(apiResponse.message, "Update!");
          this.allLists.length = 0;
        }
      }, (err) => {
        this.toastr.error("Some Error Occurred", "Error!");
        this.allLists.length = 0;
      });
    } else {
      this.toastr.info("Missing Authorization Key", "Please login again");
    }

  }//end getAllPublicListFunction


  getUpdatesFromContainer(data) {

    let dataForNotify = {
      message: data.message,
      userId: this.userFriends,
      listId: data.listId
    }
    this.notifyUpdatesToUser(dataForNotify);
  }


  public notifyUpdatesToUser: any = (data) => {
    this.socketService.notifyUpdates(data);
    if (!data.listId)
      this.getAllPublicListFunction(this.userFriendsTemp)
  }//end notifyUpdatesToUser


  public deleteUser = () => {
    this.appService.deleteUser(this.userId, this.authToken).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.toastr.success('Your Account is successfully deleted', 'Success!' )
        Cookie.deleteAll()
        setTimeout(() => {
          this.router.navigate(['login'])
          this.toastr.success('Hope You Back Again!', 'Thank you!')
        })
      }else {
        this.toastr.error(apiResponse.message, 'Error!')
      }
    }, (err) => {
      console.log(err)
      this.toastr.error('failed to delete user', 'Error!')
    })
  }




  public logout = () => {

    this.appService.logout().subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          this.fullName = Cookie.get('fullName')
          localStorage.clear();
          Cookie.deleteAll()
          this.toastr.success(this.fullName.toUpperCase(), 'Logout Success! See You Again')
          this.router.navigate(['login']);
        } else {
          this.toastr.error(apiResponse.message, "Error!")
        }
      }, (err) => {
        this.toastr.error("Some Error Occurred", "Error!");
      });

  }//end logout 

}
