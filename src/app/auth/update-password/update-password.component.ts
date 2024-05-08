import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CookieService } from 'ngx-cookie-service'; // Importer CookieService depuis ngx-cookie-service
import { AuthenticationRequest } from '../model/authentication-request';
import { AuthenticationResponse } from '../model/authentication-response';
import { AdminGuard } from '../services/AdminGuard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent {
  constructor(private formBuilder: FormBuilder, public userService: UserServiceService, private router: Router, private cookieService: CookieService, private route: ActivatedRoute) { } // Injecter CookieService ici
  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), this.validatePassword]],
      confirmpassword: ['', Validators.required],

    })
  }
  validatePassword(control: any) {
    // Validation personnalisée pour vérifier si le mot de passe contient des majuscules, des minuscules, des chiffres et des caractères spéciaux
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }

  passwordForm: FormGroup | any;
  passwordFormInvalid: boolean = false;
  sumbit() {
    if ((this.passwordForm.controls.password.value !== this.passwordForm.controls.confirmpassword.value)) {
      this.passwordFormInvalid = true
    }
    else
      if (this.passwordForm.valid) {
        // Récupérer le token de l'URL
        const token = this.route.snapshot.queryParamMap.get('token');

        // Vérifier si le token existe
        if (!token) {
          throw new Error('Token not found in URL');
        } else {
          const request: any = {
            password: this.passwordForm.controls.password.value,
            token: token
          };
          this.userService.resetPassword(request).subscribe(
            (response: any) => {
              this.toggleValider()
              setTimeout(() => {
                this.router.navigate(['/login']);

              }, 2000);
            },
            (error) => {
              this.toggleIdnvalidAlert()
            }
          );
        }

      }

  }


  openPopUp: string = "";
  showValiderAlert: boolean = false;
  showInvalidAlert: boolean = false;
  toggleValider() {
    this.showValiderAlert = true;
    this.userService.toggleModalConfirmer();
    setTimeout(() => {
      this.showValiderAlert = false;
    }, 2000); // 5000 milliseconds = 5 seconds, adjust as needed

  }
  toggleIdnvalidAlert() {
    this.showInvalidAlert = true;
    this.userService.toggleModalConfirmer();
  }
  closeModal() {
    this.userService.closeModal();

  }
}
