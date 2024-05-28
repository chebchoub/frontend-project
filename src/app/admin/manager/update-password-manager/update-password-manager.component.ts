import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerServiceService } from '../../services/manager-service.service';
import { SuperManagerService } from '../../services/super-manager.service';
import { UserServiceService } from '../../../auth/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-password-manager',
  templateUrl: './update-password-manager.component.html',
  styleUrl: './update-password-manager.component.css'
})
export class UpdatePasswordManagerComponent implements OnInit{
  constructor(private formBuilder: FormBuilder, public serviceManager: ManagerServiceService,public superManagerService:SuperManagerService,public userService: UserServiceService, private router: Router, private route: ActivatedRoute) { } // Injecter CookieService ici
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
      if(this.superManagerService.checkSuperManager)
        {
          this.userService.changeSuperManagerPassword(this.serviceManager.ManagerLOGINID.id,this.passwordForm.controls.password.value).subscribe(
            (response: any) => {
              this.toggleValider()
            },
            (error) => {
              this.toggleIdnvalidAlert()
    
            }
          );
        }else
        {
          this.userService.changeManagerPassword(this.serviceManager.ManagerLOGINID.id,this.passwordForm.controls.password.value).subscribe(
            (response: any) => {
              this.toggleValider()
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
