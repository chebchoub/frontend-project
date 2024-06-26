import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormGroup } from '@angular/forms';
import { Technician } from '../../dto/technicien';
import { EmailServiceService } from '../../services/email-service.service';;
@Component({
  selector: 'app-send-email-client',
  templateUrl: './send-email-client.component.html',
  styleUrls: ['./send-email-client.component.css']
})
export class SendEmailClientComponent implements OnInit {
  constructor(public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  client:any;
  subject: string = "";
  body: string = "";
  to: string = "";
  isLoading:boolean=false;
  ngOnInit(): void {
    this.client=this.emailService.client;
    this.to=this.client.email;
    this.subject="";
    this.body= `Cher  ${this.client.contract.entreprise},\n\nCordialement,\ndnen HAMMADI\nAdministrateur`;
  }
  sendEmail() {
    this.isLoading=true
    this.emailService.sendEmail(this.to, this.subject, this.body).subscribe(
      response => {
        console.log('Email sent successfully:', response);
        this.isLoading=false

        this.toggleModalSendEmailconfirm()

      },
      error => {
        this.isLoading=false

        console.error('Error sending email:', error);
        // Handle error, if needed
      }
    );
  }

  closeModal() {
    this.emailService.closeModal();
  }
  showvalidEmaiAlert: boolean = false;

  openPopUp:string="";
  toggleModalSendEmailconfirm() {
    this.showvalidEmaiAlert=true;
    this.emailService.toggleModalConfirmer();
    setTimeout(() => {
      this.showvalidEmaiAlert = false;

    }, 2000); 
  }
  closeModal2() {
    this.emailService.closeModalConfimer();
  }

}
