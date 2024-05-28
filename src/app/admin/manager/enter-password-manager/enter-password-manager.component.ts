import { Component, OnInit } from '@angular/core';
import { ManagerServiceService } from '../../services/manager-service.service';
import { EmailServiceService } from '../../services/email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IImage, ImageCompressService } from 'ng2-image-compress';
import { SuperManagerService } from '../../services/super-manager.service';
import { UserServiceService } from '../../../auth/services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-enter-password-manager',
  templateUrl: './enter-password-manager.component.html',
  styleUrl: './enter-password-manager.component.css'
})
export class EnterPasswordManagerComponent implements OnInit{

  constructor(private superManagerService:SuperManagerService,private userService:UserServiceService,private cookieService:CookieService,private imgCompressService: ImageCompressService,private formBuilder: FormBuilder,public  managerService:ManagerServiceService, public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  ngOnInit(): void {
    this.formPassword = this.formBuilder.group({
      password: ['', [Validators.required,]],
    });  }
  formPassword: FormGroup | any;
  
  closeModal() {
    this.managerService.closeModal();
  }
  openPopUp: string = "";
  FormInvalid:boolean=false;
  falseResponce:boolean=false;

  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.managerService.toggleModalConfirmer();

  }
  submit() {
    if( this.formPassword.controls.password.value===""||!this.formPassword.valid)
      {
        this.FormInvalid=true;
  
      }
      else
      {
        if(this.superManagerService.checkSuperManager)
          {
            this.userService.verifPasswordSuperManager(  this.managerService.ManagerLOGINID.id,this.formPassword.controls.password.value).subscribe(
              (response: any) => {
                
               
              },
              (error) => {
                if(error.error.text=="Password is correct"){
                  this.toggleModelUpdateValid()

                }else  if(error.error=="Invalid password"){
                  this.falseResponce=true;
                }
               

              }
            );
          }
          else
          { 
            console.log(this.managerService.ManagerLOGINID.id,this.formPassword.controls.password.value)
            this.userService.verifPasswordManager(this.managerService.ManagerLOGINID.id,this.formPassword.controls.password.value).subscribe(
              (response: any) => {
              
              },
              (error) => {
                console.log(error)
                if(error.error.text=="Password is correct"){
                  this.toggleModelUpdateValid()

                }else  if(error.error=="Invalid password"){
                  this.falseResponce=true;
                }
              }
            );
          }
       
      }
  }
}
