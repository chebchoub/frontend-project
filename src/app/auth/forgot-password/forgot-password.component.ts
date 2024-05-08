import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CookieService } from 'ngx-cookie-service'; // Importer CookieService depuis ngx-cookie-service
import { AuthenticationRequest } from '../model/authentication-request';
import { AuthenticationResponse } from '../model/authentication-response';
import { AdminGuard } from '../services/AdminGuard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, public userService: UserServiceService, private router: Router, private cookieService: CookieService) { } // Injecter CookieService ici
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
    })
  }
  loginForm: FormGroup | any;

  closeModal() {
    this.userService.closeModal();
    this.router.navigate(['/login']);

  }
  loginFormInvalid:boolean=false;

  sendEmail() {
    if( this.loginForm.controls.email.value==="")
      {
        this.loginFormInvalid=true;
  
      }
      else
      {
        this.userService.forgotPassword(this.loginForm.controls.email.value).subscribe(
          (response: any) => {
          console.log("envoyer")
          this.toggleModCheckEmail()
          },
          (error) => {
            console.log(error);
            if (error && error.statusText === "Not Found") {
              this.toggleModInvalidEmailAlert()
            }
          }
        );
      }
}
  toggleModalForgotPassword() {
    this.userService.toggleModalConfirmer();

  }
  openPopUp: string = "";
  showCheckEmaiAlert: boolean = false;
  showInvalidEmailAlert: boolean = false;
  toggleModCheckEmail() {
    this.showCheckEmaiAlert=true;
    this.userService.toggleModalConfirmer();
    setTimeout(() => {
      this.showCheckEmaiAlert = false;
    }, 2000); // 5000 milliseconds = 5 seconds, adjust as needed
  }
  toggleModInvalidEmailAlert() {
    this.showInvalidEmailAlert=true;
    this.userService.toggleModalConfirmer();
  }
 
}
