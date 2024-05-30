import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormGroup } from '@angular/forms';
import { Technician } from '../../dto/technicien';
import { EmailServiceService } from '../../services/email-service.service';;

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent {

  constructor(public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }

  technicien:any;
  isLoading:boolean=false;
  ngOnInit(): void {
    this.technicien = this.emailService.technicien;
    this.titreTicket=this.emailService.titreTicket;
    this.dateouverture=this.emailService.dateouverture;
     this.to=this.technicien.email;
    if(this.titreTicket===""&&this.dateouverture==="")
      {
        this.subject="";
        this.body= `Cher  ${this.technicien.firstName},\n\nCordialement,\ndnen HAMMADI\nAdministrateur`;
      }
      else
      {
        this.subject = "Rappel - Tickets en attente de résolution :";
    this.body = `Cher ${this.technicien.firstName},\n\nJe vous écris pour vous rappeler qu'il y a un ticket en attente de résolution qui vous est attribué 
   \n\ndu ticket : ${this.titreTicket}\nDate d'ouverture du ticket : ${this.dateouverture}\n\nNous vous encourageons à examiner ce ticket dès que possible et à travailler sur sa résolution. Si vous avez besoin de toute assistance supplémentaire ou si vous rencontrez des problèmes, n'hésitez pas à nous contacter pour obtenir de l'aide.\n\nMerci pour votre dévouement à fournir un excellent service à nos clients.
   \n\nCordialement,\ndnen HAMMADI\nAdministrateur`;
      }

  }
  subject: string = "";
  body: string = "";
  to: string = "";
  titreTicket:string=""
  dateouverture:string=""

  sendEmail() {
    this.isLoading=true
    this.emailService.sendEmail(this.to, this.subject, this.body).subscribe(
      response => {
        console.log('Email sent successfully:', response);
        this.isLoading=false
        this.toggleModalSendEmailconfirm()
      },
      error => {
        console.error('Error sending email:', error);
        this.isLoading=false

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
