import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public fullName: string;
  public userId: any;
  public authToken: any;
  public userDetails: any;
  public firstName:string;
  public lastName: string;
  public mobileNumber: any;
  public email: any;
  public registerDate: any;


  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.fullName = Cookie.get('fullName')
    this.userId = Cookie.get('userId')
    this.authToken = Cookie.get('authToken')
    this.getDetails();
  }

  public getDetails = () => {
    this.appService.getSingleUserDetails(this.userId, this.authToken).subscribe((apiResponse) => {
      if(apiResponse.status === 200) {
        this.userDetails = apiResponse.data
        this.firstName = apiResponse.data.firstName
        this.lastName = this.userDetails.lastName
        this.email = this.userDetails.email,
        this.mobileNumber = this.userDetails.mobileNumber
        this.registerDate = this.userDetails.createdOn
      } else {
        this.toastr.warning(apiResponse.message, 'warning!')
      }
    }, (err) => {
      this.toastr.error(err.message, 'Error!')
    })
  }

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
