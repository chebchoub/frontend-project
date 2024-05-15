import { Component, OnInit } from '@angular/core';
import { EmailServiceService } from '../../services/email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ManagerServiceService } from '../../services/manager-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // import FormBuilder

@Component({
  selector: 'app-send-email-create-manager',
  templateUrl: './send-email-create-manager.component.html',
  styleUrl: './send-email-create-manager.component.css'
})
export class SendEmailCreateManagerComponent implements OnInit {
  constructor(  private formBuilder: FormBuilder ,public serviceManager: ManagerServiceService, public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: [, [Validators.required, this.emailFormatValidator]]
    })
  }
  emailForm: FormGroup | any;
  emailFormatValidator(control: any) {
    // Expression régulière pour vérifier le format de l'e-mail
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailPattern.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }

  emailFormInvalid: boolean = false;

  sendEmail() {
    if (this.emailForm.controls.email.value === "" || !this.emailForm.valid) {
      this.emailFormInvalid = true;

    }
    else {
      this.serviceManager.sendEmailToCreate(this.emailForm.controls.email.value).subscribe(
        (response: any) => {
          console.log("envoyer")
          this.toggleModValidEmail()
        },
        (error: any) => {
          console.log(error);
          this.toggleModInvalidEmailAlert()

        }
      );
    }
  }

  openPopUp: string = "";
  showvalidEmaiAlert: boolean = false;
  showInvalidEmailAlert: boolean = false;
  toggleModValidEmail() {
    this.showvalidEmaiAlert = true;
    this.serviceManager.toggleModalConfirmer();
    setTimeout(() => {
      this.showvalidEmaiAlert = false;
    }, 2000);
    // 5000 milliseconds = 5 seconds, adjust as needed
  }
  toggleModInvalidEmailAlert() {
    this.showInvalidEmailAlert = true;
    this.serviceManager.toggleModalConfirmer();
    setTimeout(() => {
      this.showvalidEmaiAlert = false;
    }, 2000);
  }
  closeModal() {
    this.serviceManager.closeModal();

  }
}
