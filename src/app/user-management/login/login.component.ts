import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;
  public fullName: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
  ) { }

  public goToSignup = () => {
    this.router.navigate(['signup'])
  }

  public loginFunction() {
    if (!this.email) {
      this.toastr.warning('Email is required', 'Warning!')
    } else if (!this.password) {
      this.toastr.warning('Password is required', 'Warning!')
    } else {
      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.login(data).subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          Cookie.set('authToken', apiResponse.data.authToken)
          Cookie.set('userId', apiResponse.data.userDetails.userId)
          Cookie.set('email', apiResponse.data.userDetails.email)
          Cookie.set('fullName', `${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);

          this.fullName = Cookie.get('fullName')
          this.appService.setLocalStorage(apiResponse.data.userDetails)
          setTimeout(() => {
            this.toastr.success(this.fullName.toUpperCase(), 'Welcome!')
            this.router.navigate(['single-user'])
          }, 1000)
        } else {
          this.toastr.error(apiResponse.message, 'Error!')
        }
      }, (err) => {
        if (err.status === 400) {
          this.toastr.error(err.message, 'Error!')
        }else{
          this.toastr.error(err.message)
        }
      })
    }
  }

  ngOnInit(): void {
  }

}
