import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CookieService } from 'ngx-cookie-service'; // Importer CookieService depuis ngx-cookie-service
import { AuthenticationRequest } from '../model/authentication-request';
import { AuthenticationResponse } from '../model/authentication-response';
import { AdminGuard } from '../services/AdminGuard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ClientRequest } from '../model/client-request';

@Component({
  selector: 'app-client-register',
  templateUrl: './client-register.component.html',
  styleUrl: './client-register.component.css'
})
export class ClientRegisterComponent {
  showConfirmationAlert: boolean = false;
  showInvalidRegisterAlert: boolean = false;

  registerForm1: FormGroup | any;
  registerForm2: FormGroup | any;
  registerForm3: FormGroup | any;
  constructor(private formBuilder: FormBuilder, public userService: UserServiceService, private router: Router, private cookieService: CookieService) {


  }
  ngOnInit(): void {
    this.registerForm1 = this.formBuilder.group({
      entreprise: ['', [Validators.required, Validators.maxLength(15)]],
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      location: ['', Validators.required],
      companyLogo: ['', Validators.required],


    });
    this.registerForm2 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.validatePassword]],
      confirmpassword: ['', Validators.required]
    });
    this.registerForm3 = this.formBuilder.group({
      contractSerialNumber: ['', [Validators.required, Validators.pattern(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/)]]

    });

  }

  // Fonction de validation personnalisée pour le numéro de téléphone
  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    const phoneNumberPattern = /^[0-9]{8}$/; // Le numéro de téléphone doit contenir exactement 8 chiffres

    if (!phoneNumberPattern.test(phoneNumber)) {
      return { validatePhoneNumber: true }; // Retourne une erreur si le numéro de téléphone est invalide
    }
    return null;
  }
  emailValidator(control: any): { [key: string]: boolean } | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }

  validatePassword(control: any) {
    // Validation personnalisée pour vérifier si le mot de passe contient des majuscules, des minuscules, des chiffres et des caractères spéciaux
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }


  currentStep = 1;
  invalidform: boolean = false;
  invalidformPassword: boolean = false;

  passerAStep(step: number) {

    if (step == 2) {
      if (this.registerForm1.valid || this.companyImage !== "") {

        this.currentStep = 2;

      } else {
        this.invalidform = true;
      }



    } else if (step == 3) {
      if (this.registerForm2.controls.password.value !== this.registerForm2.controls.confirmpassword.value) {
        this.invalidformPassword = true;

      } else {
        if (this.registerForm2.valid) {

          this.currentStep = 3;

        } else {
          // Afficher des messages d'erreur appropriés
          console.log("Veuillez remplir correctement le formulaire.");
        }
      }

    } else if (step == 1) {
      this.currentStep = 1;

    }

  }
  submit() {
    const clientRequestDetails: ClientRequest = {
      email: this.registerForm2.controls.email.value,
      phoneNumber: this.registerForm1.controls.phoneNumber.value,
      password: this.registerForm2.controls.password.value,
      location: this.registerForm1.controls.location.value,
      contractId: this.registerForm3.controls.contractSerialNumber.value,
      companyLogo: this.companyImage
    };

    this.userService.registerClient(clientRequestDetails).subscribe(
      (token: any) => {
        this.toggleModConfimer()
        setTimeout(() => {
          this.router.navigate(['/login']);

        }, 2000);
      },
      (error) => {
        console.log(error);
        if (error && error.error === "Invalid contract ID: Invalid contract ID") {
          this.toggleModInvalidRegisterAlert()
        }
      }
    );
  }
  openPopUp: string = "";
  toggleModConfimer() {
    this.showConfirmationAlert = true;
    this.userService.toggleModalConfirmer();
    setTimeout(() => {
      this.showConfirmationAlert = false;
    }, 2000); // 5000 milliseconds = 5 seconds, adjust as needed
  }
  toggleModInvalidRegisterAlert() {
    this.showInvalidRegisterAlert = true;
    this.userService.toggleModalConfirmer();
  }
  closeModal() {
    this.userService.closeModalConfimer();

  }
  eventFile: any;
  companyImage: string = "";
  onSelectFile(event: any) {

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent: any) => {
        this.companyImage = innerEvent.target.result;
      }
    }
  }
}
