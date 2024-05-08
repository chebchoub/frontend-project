import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrl: './enter-password.component.css'
})
export class EnterPasswordComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.formPassword = this.formBuilder.group({
      password: ['', [Validators.required,]],
    });  }
  formPassword: FormGroup | any;
  
  closeModal() {
    this.serviceClient.closeModal();

  }
  openPopUp: string = "";
  FormInvalid:boolean=false;
  falseResponce:boolean=false;

  showUpdateValid: boolean = false;
  toggleModelUpdateValid() {
    this.showUpdateValid = true;
    this.serviceClient.toggleModalConfirmer();

  }
  submit() {
    if( this.formPassword.controls.password.value===""||!this.formPassword.valid)
      {
        this.FormInvalid=true;
  
      }
      else
      {
        this.serviceClient.verifPassword( this.serviceClient.clientLogedIn.id,this.formPassword.controls.password.value).subscribe(
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
