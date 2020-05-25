import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public div1: boolean = true;
  public div2: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public forgot = () => {
    this.div1 = false;
    this.div2 = true;
  }

}
