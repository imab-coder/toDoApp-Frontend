import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  public authToken: string;
  public userId: string;
  public fullName: string;
  public userInfo: any;
  public userDetails: any;
  public totalFriends: any;
  public totalReqRec: any;
  public totalReqSent: any;
  public allUsers: any = [];
  public allUsersData: any = [];
  public userFriends: any = [];
  public requestRecieved: any;
  public requestSents: any;
  public onlineUserList: any;
  public sentReqLength: any;
  public recieveReqLength: any;

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.fullName = Cookie.get('fullName');
    this.userInfo = this.appService.getLocalStorage()

    this.getUpdatedResultOnLoad()
    this.getUpdatesFromUser()
    this.getOnlineUserList()
  }


  public sendFriendRequest(recieverId, recieverName): any {

    let data = {
      senderId: this.userId,
      senderName: this.fullName,
      recieverId: recieverId,
      recieverName: recieverName,
      authToken: this.authToken
    }

    this.appService.sendFriendRequest(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.success("Friend Request Sent", "Success");
        this.getUpdatedResultOnLoad()
        let dataForNotify = {
          message: `${data.senderName} has sent you a friend request.`,
          userId: data.recieverId
        }
        this.notifyUpdatesToUser(dataForNotify);
      } else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    }, (error) => {
      this.toastr.error("Failed to Send Friend Request, Some Error Occurred", "Error!");
    })
  }//end sendFriendRequest

  public deleteFriendRequest(senderId, senderName): any {
    let data = {
      senderId: senderId,
      senderName: senderName,
      recieverId: this.userId,
      recieverName: this.fullName,
      authToken: this.authToken
    }

    this.appService.deleteFriendRequest(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.success("Friend Request Rejected", "Success");
        this.getUpdatedResultOnLoad()

        let dataForNotify = {
          message: `${data.recieverName} has rejected your friend request.`,
          userId: data.senderId
        }
        this.notifyUpdatesToUser(dataForNotify);
      } else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    }, (error) => {
      this.toastr.error("Failed to Reject Friend Request, Some Error Occurred", "Error!");
    })
  }//end DeletefriendReq

  public cancelFriendRequestFunction(recieverId, recieverName): any {
    let data = {
      senderId: this.userId,
      senderName: this.fullName,
      recieverId: recieverId,
      recieverName: recieverName,
      authToken: this.authToken
    }
    this.appService.cancelFriendRequest(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.success("Friend Request Canceled", "Success");
        this.getUpdatedResultOnLoad()

        let dataForNotify = {
          message: `${data.senderName} has Canceled friend request.`,
          userId: data.recieverId
        }
        this.notifyUpdatesToUser(dataForNotify);
      } else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    }, (error) => {
      this.toastr.error("Failed to Cancel Friend Request, Some Error Occurred", "Error!");
    })
  }//end cancelFriendRequestFunction

  /* User Related Functions */
  public userSelectedToSentRequest(user) {
    let recieverId = user.userId;
    let recieverName = user.firstName + ' ' + user.lastName;
    this.sendFriendRequest(recieverId, recieverName)
  }

  public userSelectedToCancelRequest(user) {
    let recieverId = user.friendId;
    let recieverName = user.friendName;
    this.cancelFriendRequestFunction(recieverId, recieverName)
  }

  public userSelectedToDeleteRequest(user) {
    let senderId = user.friendId;
    let senderName = user.friendName;
    this.deleteFriendRequest(senderId, senderName)
  }

  public userSelectedToAcceptRequest(user) {
    let senderId = user.friendId;
    let senderName = user.friendName;
    this.acceptFriendRequestFunction(senderId, senderName)
  }

  public acceptFriendRequestFunction(senderId, senderName): any {
    let data = {
      senderId: senderId,
      senderName: senderName,
      recieverId: this.userId,
      recieverName: this.fullName,
      authToken: this.authToken
    }

    this.appService.acceptFriendRequest(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.success("Friend Request Accepted", "Success");
        this.getUpdatedResultOnLoad()

        let dataForNotify = {
          message: `${data.recieverName} has accepted your friend request.`,
          userId: data.senderId
        }
        this.notifyUpdatesToUser(dataForNotify);
      } else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    }, (error) => {
      this.toastr.error("Failed to accept Friend Request, Some Error Occurred", "Error!");
    })
  }//end acceptFriendRequestFunction


  public getUpdatedResultOnLoad = () => {

    let getUserDetailsPromise = () => {
      return new Promise((resolve, reject) => {
        if (this.authToken != null && this.userId != null) {
          this.appService.getSingleUserDetails(this.userId, this.authToken).subscribe((apiResponse) => {
            if (apiResponse.status == 200) {
              this.userDetails = apiResponse.data;
              this.appService.setLocalStorage(this.userDetails);
              resolve(this.userDetails)
            } else {
              this.toastr.info(apiResponse.message, "Update!");
              reject(apiResponse.message)
            }
          }, (error) => {
            this.toastr.error("Some Error Occurred", "Error!");
          })
        } else {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(['login']);
        }
      })
    }// end getUserDetailsPromise

    let getAllUsersPromise = (userDetails) => {

      return new Promise((resolve, reject) => {
        if (this.authToken != null) {
          this.appService.getAllUsers(this.authToken).subscribe((apiResponse) => {
            if (apiResponse.status == 200) {

              this.allUsers = apiResponse.data;
              this.allUsers = this.allUsers.filter(user => user.userId != this.userId);
              this.allUsersData = this.allUsers
              this.userFriends = userDetails.friends;
              this.requestSents = userDetails.friendRequestSent;
              this.sentReqLength = this.requestSents.length
              this.requestRecieved = userDetails.friendRequestRecieved;
              this.recieveReqLength = this.requestRecieved.length
              this.totalFriends = this.userFriends.length
              for (let user of this.allUsers) {
                for (let friend of this.userFriends) {
                  if (user.userId == friend.friendId) {
                    user.connected = true
                  }
                }
              }

              for (let user of this.allUsers) {
                for (let friendSent of this.requestSents) {
                  if (user.userId == friendSent.friendId) {
                    this.allUsers = this.allUsers.filter(user => user.userId != friendSent.friendId);
                  }
                }
              }

              for (let user of this.allUsers) {
                for (let friendRecieved of this.requestRecieved) {
                  if (user.userId == friendRecieved.friendId) {
                    this.allUsers = this.allUsers.filter(user => user.userId != friendRecieved.friendId);
                  }
                }
              }
              resolve(this.allUsers)
            } else {
              this.toastr.info(apiResponse.message, "Update!");
              reject(apiResponse.message)

            }
          }, (error) => {
            this.toastr.error("User List falied to Update, Some Error Occurred", "Error!");
          })
        } else {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(['login']);
        }
      })
    } //end getAllUsersPromise


    getUserDetailsPromise()
      .then(getAllUsersPromise)
      .then((resolve) => {
        //console.log(resolve)
      })
      .catch((err) => {
        console.log("errorhandler");
        console.log(err);
      })
  }

  public notifyUpdatesToUser = (data) => {
    this.socketService.notifyUpdates(data);

  }//end notifyUpdatesToUser

  public getUpdatesFromUser = () => {

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {
      this.toastr.info(data.message);
      this.getUpdatedResultOnLoad()
    });
  }

  public getOnlineUserList = () => {
    this.socketService.onlineUserList().subscribe((data) => {
      this.onlineUserList = []
      for (let x in data) {
        this.onlineUserList.push(x);
      }
      for (let user of this.allUsers) {
        if (this.onlineUserList.includes(user.userId)) {
          user.status = "online"
        } else {
          user.status = "offline"
        }
      }
    })
  }//end getOnlineUserList

  ngOnDestroy() {
    this.socketService.exitSocket()
  }

}
