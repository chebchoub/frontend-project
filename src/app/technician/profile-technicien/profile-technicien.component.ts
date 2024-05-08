import { Component, OnInit } from '@angular/core';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-technicien',
  templateUrl: './profile-technicien.component.html',
  styleUrl: './profile-technicien.component.css'
})
export class ProfileTechnicienComponent implements OnInit{
  
  constructor(public technicienService:ServiceTechnicianService,public userService:UserServiceService,private formBuilder: FormBuilder,private router: Router)
  {

  }
  ngOnInit(): void {
    this.technicienService.getPageName = "PROFILE";
    this.getTechnicianDetails()
    this.updateProfileForm = this.formBuilder.group({
      profilePhoto: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email, this.emailValidator]],
    });
    this.file = this.technician.profilePhoto
  }

  technician:any;
  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technician=technician;
          this.technicienService.technicianLogedIn=technician;
          this.profilePhotoURL = this.technician?.profilePhoto || '';});
          this.updateProfileForm.patchValue({
            email: this.technician.email,
            firstName: this.technician.firstName,
            lastName: this.technician.lastName,
          });
         
      });
  }
  emailValidator(control: any): { [key: string]: boolean } | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }
  updateProfileForm: FormBuilder | any;
  invalidform: boolean = false;
  password: string = 'mySecretPassword';
  showPassword: boolean = false;
  profilePhotoURL: string = '';
  file: string = '';
  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.file = _file;
      this.profilePhotoURL = this.file;
      this.onSelectFile(event)
      this.resetInput();
    }

  }
  onSelectFile(event: any) {

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent: any) => {
        this.profilePhotoURL = innerEvent.target.result;
      }
    }
  }
  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }
  inputemail: boolean = false;  
  inputcompanyLogo: boolean = false;
  inputFirstName: boolean = false;
  inputLastName: boolean = false;
  updateToInput(label: string) {
    if (label === "email") {
      this.inputemail = true;
    }
    else if (label === "FirstName") {
      this.inputFirstName = true

    }
    else if (label === "LastName") {
      this.inputLastName = true

    }
    else if (label === "companyLogo") {
      this.inputcompanyLogo = true

    }
    this.updateProfileForm.patchValue({
      email: this.technician.email,
      firstName: this.technician.firstName,
      lastName: this.technician.lastName,
    });
  }
  submit() {
   /* const clientRequest: any = {
      email: this.updateProfileForm.controls.email.value,
      phoneNumber: this.updateProfileForm.controls.phoneNumber.value,
      location: this.updateProfileForm.controls.location.value,
      companyLogo: this.companyLogoURL
    }
    this.technicienService.updateUpdateTechnicien(clientRequest, this.technician.id).subscribe(
      (response: any) => {
        this.toggleModelUpdateValid()    
      }
    );*/
  }
  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.technicienService.toggleModalConfirmer();
    setTimeout(() => {
      location.reload();
    }, 3000); 
  }

  openPopUp: string = "";
  toggleModalUpdateProfile(destination: string) {
    this.openPopUp = destination;
    this.technicienService.toggleModal();
  }
  closeModal() {
    this.technicienService.closeModal();
  }
}
