import { Component, OnInit } from '@angular/core';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from 'ng2-image-compress';

@Component({
  selector: 'app-profile-technicien',
  templateUrl: './profile-technicien.component.html',
  styleUrl: './profile-technicien.component.css'
})
export class ProfileTechnicienComponent implements OnInit{
  
  constructor(private imgCompressService: ImageCompressService,public technicienService:ServiceTechnicianService,public userService:UserServiceService,private formBuilder: FormBuilder,private router: Router)
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
    this.updatespecialitieForm=this.formBuilder.group({
      specialitie:[,Validators.required]

    })
    this.file = this.technician.profilePhoto
  }
  updatespecialitieForm:FormBuilder | any;
  technician:any;
  newSpecialities!:any[];
  specialitiesBefore!:any[];
  allSpecialities: string[] = ["Virtualization", "Developer", "OpenStack", "Ansible", "Satellite", "Gboss", "JEE", "AmazonCloud", "OpenShift"];

  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technician=technician;
          this.technicienService.technicianLogedIn=technician;
          this.specialitiesBefore = [...this.technician.specialities];
          console.log(this.specialitiesBefore)
          this.newSpecialities = this.allSpecialities.filter(speciality => !this.specialitiesBefore.includes(speciality));
          console.log(this.newSpecialities)
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

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }
  onChange(fileInput: any) {
    let fileList: FileList;

    let images: Array<IImage> = [];

    // Convertir fileInput.target.files en FileList
    fileList = fileInput.target.files;

    // Vérifier si fileList est défini et non null
    if (fileList) {
      // Convertir FileList en un tableau de fichiers
      let files: File[] = Array.from(fileList);

      ImageCompressService.filesArrayToCompressedImageSource(files).then(observableImages => {
        observableImages.subscribe((image) => {
          this.profilePhotoURL = image.compressedImage.imageDataUrl;
        }, (error) => {
          console.log("Error while converting");
        });
      });
    }
  }
  inputemail: boolean = false;  
  inputProfilePhoto: boolean = false;
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
    else if (label === "ProfilePhoto") {
      this.inputProfilePhoto = true

    }
    this.updateProfileForm.patchValue({
      email: this.technician.email,
      firstName: this.technician.firstName,
      lastName: this.technician.lastName,

    });
  }
  submit() {
     const technicianRequest: any = {
      email: this.updateProfileForm.controls.email.value,
      firstName: this.updateProfileForm.controls.firstName.value,
      lastName: this.updateProfileForm.controls.lastName.value,
      profilePhoto: this.profilePhotoURL,
    }
    this.technicienService.updateUpdateTechnicien(technicianRequest, this.technician.id).subscribe(
      (response: any) => {
        this.toggleModelUpdateValid()
      }
    );
  }
  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.technicienService.toggleModalConfirmer();
    setTimeout(() => {
      location.reload();
    }, 2000); 
  }
  selectedSpecialities: string[] = []; 

  updateSpecialities(event: any) {
    const isChecked = event.target.checked;
    const speciality = event.target.value;
  
    if (isChecked) {
      this.selectedSpecialities.push(speciality);
    } else {
      const index = this.selectedSpecialities.indexOf(speciality);
      if (index !== -1) {
        this.selectedSpecialities.splice(index, 1);
      }
    }
  }
  updateSpecialitie()
  {
    this.technicienService.updateUpdateTechnicienSpecialitie(this.selectedSpecialities, this.technician.id).subscribe(
      (response: any) => {
        this.closeModal()
        
        this.toggleModelUpdateValid()
      }
    );  }
  openPopUp: string = "";
  toggleModalUpdateProfile(destination: string) {
    this.openPopUp = destination;
    this.technicienService.toggleModal();
  }
  toggleModalAddspecialitie(destination: string)
  {
    this.openPopUp = destination;
    this.technicienService.toggleModal();
  }
  closeModal() {
    this.technicienService.closeModal();
  }
}
