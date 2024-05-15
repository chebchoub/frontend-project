import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CookieService } from 'ngx-cookie-service'; // Importer CookieService depuis ngx-cookie-service
import { AuthenticationRequest } from '../model/authentication-request';
import { AuthenticationResponse } from '../model/authentication-response';
import { AdminGuard } from '../services/AdminGuard';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ClientServiceService } from '../../Client/service/client-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public serviceClient: ClientServiceService, private formBuilder: FormBuilder, public userService: UserServiceService, private router: Router, private cookieService: CookieService) { } // Injecter CookieService ici
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required, this.emailValidator],
      password: ['', Validators.required],
    })
  }
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }
  loginForm: FormGroup | any;
  loginFormInvalid: boolean = false;
  loginFormInvalidBackend: boolean = false;

  loginUser() {
    this.cookieService.delete('jwtToken');

    if (this.loginForm.controls.email.value === "" || this.loginForm.controls.email.value === "") {
      this.loginFormInvalid = true;

    }



    const userCredentials: AuthenticationRequest = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    };

    this.userService.login(userCredentials).subscribe(
      (response: AuthenticationResponse) => {
        this.cookieService.set('jwtToken', response.token, 7, '/', '', true, 'Lax');
        const jwtToken = this.cookieService.get('jwtToken');
        this.checkRole(jwtToken)
        if (this.role === "MANAGER"||this.role ==="SUPERMANAGER") {
          this.router.navigate(['/homeAdmin']);

        }
        else if (this.role === "CLIENT") {
          this.router.navigate(['/homeClient']);
        }
        else if (this.role === "TECHNICALENGINEER") {
          this.router.navigate(['/homeTechnician']);
        }
      },
      (error) => {
        this.loginFormInvalidBackend = true;
      }
    );

  }
  
  role: string = "";

  checkRole(jwtToken: string): any {
    this.userService.checkRole(jwtToken).subscribe(
      (response: string[]) => {
        if (Array.isArray(response) && response.length > 0) {
          this.role = response[0]; // Récupérer le premier élément du tableau
          console.log(this.role);
        }
      }
    );
  }
  openPopUp: string = "";
  toggleModalForgotPassword() {
    this.userService.toggleModal();

  }
}
