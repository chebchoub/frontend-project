import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { CookieService } from 'ngx-cookie-service'; // Importer CookieService depuis ngx-cookie-service
import { AuthenticationRequest } from '../model/authentication-request';
import { AuthenticationResponse } from '../model/authentication-response';
import { AdminGuard } from '../services/AdminGuard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ClientRequest } from '../model/client-request';
import { Observable } from 'rxjs';
import { TechnicienRequest } from '../model/technicien-request';
@Component({
  selector: 'app-technicien-register',
  templateUrl: './technicien-register.component.html',
  styleUrl: './technicien-register.component.css'
})
export class TechnicienRegisterComponent {

  constructor(private formBuilder: FormBuilder, public userService: UserServiceService, private router: Router, private cookieService: CookieService,private route: ActivatedRoute) {
  }
  registerForm1: FormGroup | any;
  registerForm2: FormGroup | any;
  registerForm3: FormGroup | any;
  jwtToken!:string;
  emailTechnician!:string;
  ngOnInit(): void {
    this.jwtToken = this.route.snapshot.queryParamMap.get('token') || "";

    // Récupérer l'email du token
    this.userService.getEmailFromToken(this.jwtToken).subscribe((email: string) => {
      this.emailTechnician = email;
  
      // Initialiser le formulaire avec l'email du technicien
      
    
    console.log(this.emailTechnician)
    this.registerForm2 = this.formBuilder.group({
      email: [this.emailTechnician, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.validatePassword]],
      confirmpassword: ['', Validators.required],
      profilePhoto: ['', Validators.required]
    });
      this.registerForm1 = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('^[a-zA-Z]+$')]],
        lastName: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('^[a-zA-Z]+$')]],
      startDateWork: ['', [Validators.required, this.startDateValidator]],
      speciality:[,Validators.required]
    });
    this.registerForm3 = this.formBuilder.group({
      confimerCheckBox: [false, Validators.required]
  });
});
    
  }
  
  startDateValidator(control: any) {
    const startDate = new Date(control.value);
    const currentDate = new Date();
    if (startDate > currentDate) {
      return { 'startDateInvalid': true };
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
  currentStep = 1;
  invalidform: boolean = false;
  invalidformPassword: boolean = false;
  invalidformChecklist: boolean = false;
  selectedSpecialities: string[] = []; 
  passerAStep(step: number) {

    if (step == 2) {
     
    console.log(this.selectedSpecialities)
      if (this.registerForm1.valid ) {
                
        this.currentStep = 2;

      } else {
        if(this.selectedSpecialities.length === 0)
          {
            this.invalidformChecklist = true;

          }
        this.invalidform = true;
      }

    }else if (step == 3) {
      if (this.registerForm2.controls.password.value !== this.registerForm2.controls.confirmpassword.value) {
        this.invalidformPassword = true;

      }
        if (this.registerForm2.valid||this.profilePicture!=="") {
          this.currentStep = 3;

          
        } else 
       
          {
            this.invalidform = true;

          
      }

    } else if (step == 1) {
      this.currentStep = 1;

    }
 
  }
  submitForm() {
    if (this.registerForm3.get('confimerCheckBox').value) {
      const technicienRequest: TechnicienRequest = {
        password:this.registerForm2.controls.password.value,
        firstName:this.registerForm1.controls.firstName.value,
        lastName:this.registerForm1.controls.lastName.value,
        specialities:this.selectedSpecialities,
        profilePhoto:this.profilePicture,
        startDateWork:this.registerForm1.controls.startDateWork.value,

      }
      console.log(technicienRequest)
      this.userService.registerTechnician(technicienRequest, this.jwtToken).subscribe(
        (token: any) => {
            console.log("created")
            this.toggleModConfimer()
            setTimeout(() => {
              this.router.navigate(['/login']);

            }, 2000);
        },
        (error) => {
          this.toggleModInvalidRegisterAlert()
          
        }
      );
    
    }
    else{

      this.invalidform = true;

    }
    }
  file: string = '';
  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.file = _file;
      this.onSelectFile(event)
      this.resetInput();   
    }
  
 }
 resetInput(){
  const input = document.getElementById('avatar-input-file') as HTMLInputElement;
  if(input){
    input.value = "";
  }
}
eventFile: any;
  profilePicture: string = "";
  onSelectFile(event: any) {

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent: any) => {
        this.profilePicture = innerEvent.target.result;
      }
    }
  }
  showConfirmationAlert: boolean = false;
  showInvalidRegisterAlert: boolean = false; 
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

}
