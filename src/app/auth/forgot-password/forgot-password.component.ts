import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CookieService } from 'ngx-cookie-service'; // Importer CookieService depuis ngx-cookie-service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserServiceService,
    private router: Router,
    private cookieService: CookieService
  ) { } // Injecter CookieService ici

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
    })
  }

  loginForm: FormGroup | any;
  isLoading: boolean = false; // Ajouter cette propriété
  loginFormInvalid: boolean = false;

  closeModal() {
    this.userService.closeModal();
    this.router.navigate(['/login']);
  }

  sendEmail() {
    if (this.loginForm.controls.email.value === "") {
      this.loginFormInvalid = true;
    } else {
      this.isLoading = true; // Démarrer le spinner
      this.userService.forgotPassword(this.loginForm.controls.email.value).subscribe(
        (response: any) => {
          console.log("envoyer");
          this.isLoading = false; // Arrêter le spinner
          this.toggleModCheckEmail();
        },
        (error) => {
          console.log(error);
          this.isLoading = false; // Arrêter le spinner
          if (error && error.statusText === "Not Found") {
            this.toggleModInvalidEmailAlert();
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
    this.showCheckEmaiAlert = true;
    this.userService.toggleModalConfirmer();
    setTimeout(() => {
      this.showCheckEmaiAlert = false;
    }, 3000); // 5000 milliseconds = 5 seconds, adjust as needed
  }

  toggleModInvalidEmailAlert() {
    this.showInvalidEmailAlert = true;
    this.userService.toggleModalConfirmer();
  }
}
