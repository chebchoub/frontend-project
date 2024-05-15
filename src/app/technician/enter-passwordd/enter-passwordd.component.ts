import { Component, OnInit } from '@angular/core';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-enter-passwordd',
  templateUrl: './enter-passwordd.component.html',
  styleUrl: './enter-passwordd.component.css'
})
export class EnterPassworddComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, private router: Router, public serviceTechnician: ServiceTechnicianService, public sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.formPassword = this.formBuilder.group({
      password: ['', [Validators.required,]],
    });  }
  formPassword: FormGroup | any;
  
  closeModal() {
    this.serviceTechnician.closeModal();

  }
  openPopUp: string = "";
  FormInvalid:boolean=false;
  falseResponce:boolean=false;

  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.serviceTechnician.toggleModalConfirmer();

  }
  submit() {
    if( this.formPassword.controls.password.value===""||!this.formPassword.valid)
      {
        this.FormInvalid=true;
  
      }
      else
      {
        this.serviceTechnician.verifPassword( this.serviceTechnician.technicianLogedIn.id,this.formPassword.controls.password.value).subscribe(
          (response: any) => {
            if(response==true)
            {
              this.toggleModelUpdateValid()
            }else
            {
              this.falseResponce=true;
            }
          },
          (error) => {
            
          }
        );
      }
  }
}
