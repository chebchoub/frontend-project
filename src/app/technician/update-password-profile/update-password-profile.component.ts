import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from '../../auth/services/user-service.service';

@Component({
  selector: 'app-update-password-profile',
  templateUrl: './update-password-profile.component.html',
  styleUrl: './update-password-profile.component.css'
})
export class UpdatePasswordProfileComponent implements OnInit{
  constructor(private formBuilder: FormBuilder, public serviceTechnician: ServiceTechnicianService,public userService: UserServiceService, private router: Router, private route: ActivatedRoute) { } // Injecter CookieService ici
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
    else {
      this.serviceTechnician.changePassword(this.serviceTechnician.technicianLogedIn.id,this.passwordForm.controls.password.value).subscribe(
        (response: any) => {
          this.toggleValider()
        },
        (error) => {
          this.toggleIdnvalidAlert()

        }
      );
    }

  }


  openPopUp: string = "";
  showValiderAlert: boolean = false;
  showInvalidAlert: boolean = false;
  toggleValider() {
    this.showValiderAlert = true;
    this.userService.toggleModalConfirmer();
    setTimeout(() => {
      location.reload();
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
