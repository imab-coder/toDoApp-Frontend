import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit, OnDestroy {

  public userId:string;
  public userInfo: any;
  public authToken:string;
  public allLists:any = []
  
  public fullName: string;

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
    this.verifyUserConfirmation()
    this.getUpdatesFromUser()
    this.getAllListFunction()
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);
      },(err) => {
        this.toastr.error(err,"Some error occured");
      })
  }//end verifyUserConfirmation

  public getUpdatesFromUser = () =>{
    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) =>{
      this.toastr.info(data.message);
    });
  }

  public getUpdatesFromContainer() {
    this.getAllListFunction()
  }


  public getAllListFunction = () => {
    if (this.userId != null && this.authToken != null) {
      this.appService.getAllList(this.userId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.allLists = apiResponse.data;
        }else {
          this.toastr.info(apiResponse.message, "Update!");
          this.allLists.length = 0;
        }
      },(err) => {
        this.toastr.error("Some Error Occurred", "Error!");
      })
    }else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['login']);
    }

  }//end getAllListFunction

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
          this.router.navigate(['/']);
        } else {
          this.toastr.error(apiResponse.message,"Error!")
        }
      },(err) => {
        this.toastr.error("Some Error Occurred", "Error!");
      });

  }//end logout 

  ngOnDestroy() {
    this.socketService.exitSocket()
  }

}
