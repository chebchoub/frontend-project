import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientServiceService } from '../service/client-service.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrl: './profile-client.component.css'
})
export class ProfileClientComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.serviceClient.getPageName = "Profile";

    this.getClientDetails()
    this.updateProfileForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, this.validatePhoneNumber]],
      location: ['', Validators.required],
      profilePhoto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
    });
    this.file = this.client.companyLogo

  }
  updateProfileForm: FormBuilder | any;
  invalidform: boolean = false;
  password: string = 'mySecretPassword';
  showPassword: boolean = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  client: any;
  companyLogoURL: string = '';

  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.client=client;
          this.serviceClient.clientLogedIn=client;
          this.updateProfileForm.patchValue({
            email: this.client.email,
            phoneNumber: this.client.phoneNumber,
            location: this.client.location
          });
          this.companyLogoURL = this.client?.companyLogo || '';});
      });
   
  }
  editField(fieldName: string) {
    // Mettez en œuvre la logique pour basculer en mode édition
    console.log('Édition du champ :', fieldName);
  }

  openPopUp: string = "";
  toggleModalUpdateProfile(destination: string) {
    this.openPopUp = destination;
    this.serviceClient.toggleModal();
  }
  closeModal() {
    this.serviceClient.closeModal();
  }
  inputemail: boolean = false;
  inputphoneNumber: boolean = false;
  inputlocation: boolean = false;
  inputcompanyLogo: boolean = false;

  updateToInput(label: string) {
    if (label === "email") {
      this.inputemail = true;
    }
    else if (label === "phoneNumber") {
      this.inputphoneNumber = true
    }
    else if (label === "location") {
      this.inputlocation = true
    }
    else if (label === "companyLogo") {
      this.inputcompanyLogo = true

    }
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
  file: string = '';
  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.file = _file;
      this.companyLogoURL = this.file;
      this.onSelectFile(event)
      this.resetInput();
    }

  }
  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }
  eventFile: any;
  onSelectFile(event: any) {

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent: any) => {
        this.companyLogoURL = innerEvent.target.result;
      }
    }
  }
  submit() {
    const clientRequest: any = {
      email: this.updateProfileForm.controls.email.value,
      phoneNumber: this.updateProfileForm.controls.phoneNumber.value,
      location: this.updateProfileForm.controls.location.value,
      companyLogo: this.companyLogoURL
    }
    this.serviceClient.updateClient(clientRequest, this.client.id).subscribe(
      (response: any) => {
        this.toggleModelUpdateValid()    
      }
    );
  }
  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.serviceClient.toggleModalConfirmer();
    setTimeout(() => {
      location.reload();
    }, 3000); 
  }


}
