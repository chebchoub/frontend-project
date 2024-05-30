import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { EmailServiceService } from '../../services/email-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-send-create-email',
  templateUrl: './send-create-email.component.html',
  styleUrl: './send-create-email.component.css'
})
export class SendCreateEmailComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailFormatValidator]]
    })
  }
  emailForm: FormGroup | any;
  isLoading:boolean=false
  emailFormatValidator(control:any) {
    // Expression régulière pour vérifier le format de l'e-mail
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailPattern.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }

  closeModal() {
    this.technicianService.closeModal();

  }
  emailFormInvalid:boolean=false;

  sendEmail() {
    if( this.emailForm.controls.email.value===""||!this.emailForm.valid)
      {
        this.emailFormInvalid=true;
  
      }
      else
      {
        this.isLoading=true
        this.technicianService.sendEmailToCreate(this.emailForm.controls.email.value).subscribe(
          (response: any) => {
          console.log("envoyer")
          this.isLoading=false

          this.toggleModValidEmail()
          },
          (error) => {
            console.log(error);
            this.isLoading=false

              this.toggleModInvalidEmailAlert()
            
          }
        );
      }
}

  openPopUp: string = "";
  showvalidEmaiAlert: boolean = false;
  showInvalidEmailAlert: boolean = false;
  toggleModValidEmail() {
    this.showvalidEmaiAlert=true;
    this.technicianService.toggleModalConfirmer();
    setTimeout(() => {
      this.showvalidEmaiAlert = false;
    }, 2000); 
  // 5000 milliseconds = 5 seconds, adjust as needed
  }
  toggleModInvalidEmailAlert() {
    this.showInvalidEmailAlert=true;
    this.technicianService.toggleModalConfirmer();
    setTimeout(() => {
      this.showvalidEmaiAlert = false;
    }, 2000); 
  }

}
