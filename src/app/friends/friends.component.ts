import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-friend',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  public fullName: any;
  constructor(
    public appService: AppService,
    public router: Router,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fullName = Cookie.get('fullName')
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
          this.toastr.error(apiResponse.message,"Error!")
        }
      },(err) => {
        this.toastr.error("Some Error Occurred", "Error!");
      });

  }//end logout 

}
