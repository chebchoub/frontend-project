import { Component, OnInit } from '@angular/core';
import { ManagerServiceService } from '../../services/manager-service.service';
import { EmailServiceService } from '../../services/email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IImage, ImageCompressService } from 'ng2-image-compress';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from '../../../auth/services/user-service.service';
import { SuperManagerService } from '../../services/super-manager.service';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrl: './profile-manager.component.css'
})
export class ProfileManagerComponent implements OnInit{
  constructor(private superManagerService:SuperManagerService,private userService:UserServiceService,private cookieService:CookieService,private imgCompressService: ImageCompressService,private formBuilder: FormBuilder,public  managerService:ManagerServiceService, public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  

  
  ngOnInit(): void {

    this.contractService.getPageName = "PROFILE";

    this.updateProfileForm = this.formBuilder.group({
      profilePhoto: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email, this.emailValidator]],
    });
    this.getManagerDetails()
    this.file = this.manager.profilePhoto
  }
  manager: any;
  superManager:any;
  checkSuperManager:boolean=false;
  getManagerDetails(): void {
    const jwtToken = this.cookieService.get('jwtToken');
    this.userService.checkSuperManager(jwtToken).subscribe(
      (response) => {
        this.checkSuperManager = response;
        this.superManagerService.checkSuperManager=response;
        if (this.checkSuperManager) {
          this.superManagerService.getEmailFromToken().subscribe(
            (response) => {
              this.superManagerService.getManagerByEmail(response).subscribe(superManager => {
                this.managerService.ManagerLOGINID=superManager;
                
                this.manager = superManager;
                this.profilePhotoURL = this.manager?.profilePhoto || '';
                this.updateProfileForm.patchValue({
                  email: this.manager.email,
                  firstName: this.manager.firstName,
                  lastName: this.manager.lastName,
                });
            
              });
            });
        } else {
          this.managerService.getEmailFromToken().subscribe(
            (response) => {
              this.managerService.getManagerByEmail(response).subscribe(manager => {
                this.managerService.ManagerLOGINID=manager;
                
                this.manager = manager;
                this.profilePhotoURL = this.manager?.profilePhoto || '';
                this.updateProfileForm.patchValue({
                  email: this.manager.email,
                  firstName: this.manager.firstName,
                  lastName: this.manager.lastName,
                });
            
              });
            });
        }
      }
    );
   


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
      email: this.manager.email,
      firstName: this.manager.firstName,
      lastName: this.manager.lastName,

    });
  }
  submit() {
     const managerRequest: any = {
      email: this.updateProfileForm.controls.email.value,
      firstName: this.updateProfileForm.controls.firstName.value,
      lastName: this.updateProfileForm.controls.lastName.value,
      profilePhoto: this.profilePhotoURL,
    }
    if(this.checkSuperManager)
      {
        this.superManagerService.updateSuperManager(this.manager.id,managerRequest).subscribe(
          (response: any) => {
            this.toggleModelUpdateValid()
          }
      );}
      else{
        this.managerService.updateManager(this.manager.id,managerRequest).subscribe(
          (response: any) => {
            this.toggleModelUpdateValid()
          }
      );}
   
  }
  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.managerService.toggleModalConfirmer();
    setTimeout(() => {
      location.reload();
    }, 2000); 
  }
  

  openPopUp: string = "";
  toggleModalUpdateProfile(destination: string) {
    this.openPopUp = destination;
    this.managerService.toggleModal();
  }

  closeModal() {
    this.managerService.closeModal();
  }
}
