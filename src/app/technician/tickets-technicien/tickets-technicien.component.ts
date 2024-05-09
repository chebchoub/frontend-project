import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
interface ImageItem {
  base64Data: string;
  filename: string;
  fileType: string;
  size: number;
}

interface PDFItem {
  base64Data: string;
  filename: string;
  fileType: string;
  size: number;
}

@Component({
  selector: 'app-tickets-technicien',
  templateUrl: './tickets-technicien.component.html',
  styleUrl: './tickets-technicien.component.css'
})
export class TicketsTechnicienComponent implements OnInit {

  constructor(public technicienService: ServiceTechnicianService, public userService: UserServiceService, private formBuilder: FormBuilder, private router: Router) {

  }
  ngOnInit(): void {
    this.refreshTicket()
    this.technicienService.getPageName = "Tickets";
    this.getTechnicianDetails()
    this.technician=this.technicienService.technicianLogedIn;
    this.getAllTickets()
  
  }
  technician: any;
  ticket: any;
  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technicienService.technicianLogedIn = technician;
         
        });
      });

  }
  tickets!: any[];
  getAllTickets(): void {
    this.technicienService.getAllTicketWaitingList(this.technician.id).subscribe(tickets => {
      this.tickets = tickets;
      this.ticket = this.tickets[0]

    });
  }
  refreshTicket(ticket: any) {
    this.ticket = ticket; // Mettre à jour la référence du ticket
}

  getTicketDetails(idTicket: string): void {
    this.technicienService.getTicketById(idTicket, this.technician.id).subscribe(ticket => {
      this.ticket = ticket;
      this.technicienService.ticketSelected=ticket;
      console.log(this.technicienService.ticketSelected)

    });
  }
  downloadImage(image: ImageItem) {
    const link = document.createElement('a');
    link.href = image.base64Data; // Utiliser les données base64 de l'image comme URL
    link.download = image.filename; // Nom du fichier lors du téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF(pdf: PDFItem) {
    const link = document.createElement('a');
    link.href = pdf.base64Data; // Utiliser les données base64 du PDF comme URL
    link.download = pdf.filename; // Nom du fichier lors du téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  searchText = '';
  messageForm: FormGroup | any;

}
