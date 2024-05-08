import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormGroup } from '@angular/forms';
import { Technician } from '../../dto/technicien';
import { EmailServiceService } from '../../services/email-service.service';
@Component({
  selector: 'app-view-technician',
  templateUrl: './view-technician.component.html',
  styleUrls: ['./view-technician.component.css']
})
export class ViewTechnicianComponent implements OnInit {
  constructor(public emailService:EmailServiceService,private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  technicienId:string="";

  ngOnInit(): void {
    this.technicienId = this.technicianService.selectedTechniciaId;
    //    this.initForm();
    this.getTechnicianDetails();
  }
  currentPage: number = 0;
  pageSize: number = 2 // Nombre de contrats par page

  calculateRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.technicien.ticketWaitingList.length);
    return { start, end };
  }
  getTotalPages(): number {
    return Math.ceil(this.technicien.ticketWaitingList.length/ this.pageSize);
  }
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.technicien.ticketWaitingList.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  technicien:any;

  getTechnicianDetails(): void {
    this.technicianService.getTechnicianById(this.technicianService.selectedTechniciaId).subscribe(techicien => {
      this.technicien=techicien;
      console.log(this.technicien)
    }, error => {
      console.error('Error deleting techicien:', error);
    });

  }
  
  sendEmail(email: string): void {
    const subject = 'Sujet de l\'e-mail'; // Sujet de l'e-mail

    // Créez l'URL mailto avec l'adresse e-mail du destinataire et le sujet du message
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    // Ouvrez l'URL mailto dans une nouvelle fenêtre
    window.open(mailtoUrl, '_blank');
  }
  closeModal() {
    this.technicianService.closeModal();
  }
  to: String = "";
  subject: String = "";
  body: String = "";
  reminder(techicienEmail: string, techicienName: string,titreTicket:string,dateouverture:string): void {
    const to = techicienEmail;
    const subject = "Rappel - Tickets en attente de résolution";
    const body = `Cher ${techicienName},\n\nJe vous écris pour vous rappeler qu'il y a un ticket en attente de résolution qui vous est attribué 
    :\n\ndu ticket : ${titreTicket}\nDate d'ouverture du ticket : ${dateouverture}\n\nNous vous encourageons à examiner ce ticket dès que possible et à travailler sur sa résolution. Si vous avez besoin de toute assistance supplémentaire ou si vous rencontrez des problèmes, n'hésitez pas à nous contacter pour obtenir de l'aide.\n\nMerci pour votre dévouement à fournir un excellent service à nos clients.
    \n\nCordialement,\Adnen HAMMADI\nAdministrateur`;

    this.emailService.sendEmail(to, subject, body).subscribe(
      response => {
        console.log('Email sent successfully:', response);
      },
      error => {
        console.error('Error sending email:', error);
        // Handle error, if needed
      }
    );
  }
  openPopUp:string="";

  toggleModalSendEmail(destination: string,techicien:any,titreTicket:string,dateouverture:string) {
    this.openPopUp = destination;
    this.emailService.technicien =techicien;
    this.emailService.titreTicket=titreTicket;
    this.emailService.dateouverture=dateouverture;

    this.emailService.toggleModal();
  }
}
