import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketRequest } from '../dto/ticket-request';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ServiceTechnicianService } from '../../admin/services/service-technician.service';
import { DatePipe } from '@angular/common';
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
  selector: 'app-tickets-client',
  templateUrl: './tickets-client.component.html',
  styleUrl: './tickets-client.component.css'
})
export class TicketsClientComponent implements OnInit {
  constructor(private datePipe:DatePipe,private cookieService: CookieService,private route: ActivatedRoute,private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer,private technicianService:ServiceTechnicianService) { }
  messageForm: FormGroup | any;
  searchText = '';

  ngOnInit(): void {
    this.serviceClient.getPageName = "Tickets";

    this.getClientDetails()
    this.client= this.serviceClient.clientLogedIn;
    this.getAllTicketDesc()
    this.messageForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }
  client: any;
  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.serviceClient.clientLogedIn=client;
       });
      });

  }
  tickets!: any[];
  getAllTickets(): void {
    this.serviceClient.getAllTicketByClient(this.client.id).subscribe(tickets => {
      this.tickets = tickets;
      this.ticket = this.tickets[0]

    });
  }
  getAllTicketDesc(): void {
    this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe(tickets => {
      this.tickets = tickets;
      let ticketId=this.cookieService.get('ticketID');
      
      if(ticketId!=="")        
        {       

          this.getTicketDetails(ticketId||"")       

        }else
        {
          this.ticket=this.tickets[0]
          this.getTechnicianDetails(this.ticket.technicianId)

        }

    });
  }
  ticket: any;
  technicianImage:string="";
  getTicketDetails(ticketId: string): void {
    this.serviceClient.getTicketById(ticketId).subscribe(ticket => {

      this.ticket = ticket;
      this.getTechnicianDetails(this.ticket.technicianId)
    });
  }
  technician:any;

  getTechnicianDetails(id:string): void {
    this.technicianService.getTechnicianById(id).subscribe(techicien => {
      this.technician=techicien;
      this.technicianImage=techicien.profilePhoto;
    }, error => {
      console.error('Error deleting techicien:', error);
    });

  }
  getAllTicketByPriority(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const priority = target.value;
    if (priority === "ALL") {
      this.getAllTickets(); // Méthode pour récupérer tous les contrats

    } else {

      this.serviceClient.getByPiority(priority, this.client.id).subscribe(tickets => {
        this.tickets = tickets;

      });
    }
  }

  getAllTicketByStatus(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const status = target.value;
    if (status === "ALL") {
      this.getAllTicketDesc(); // Méthode pour récupérer tous les contrats

    } else {

      this.serviceClient.getByStatus(status, this.client.id).subscribe(tickets => {
        this.tickets = tickets;

      });
    }
  }
  sortByOpeningDate: string = 'OpeningDateAsc'; // Pour stocker le type de tri

  loadContracts(): void {

    if (this.sortByOpeningDate === 'OpeningDateAsc') {
      this.serviceClient.getByTicketOpeningDateAsc(this.client.id).subscribe(tickets => {
        this.tickets = tickets;
      });
    } else if (this.sortByOpeningDate === 'OpeningDateDesc') {
      this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe(tickets => {
        this.tickets = tickets;
      });
    }
  }
  sortTiketByOpeningDate(): void {
    if (this.sortByOpeningDate === 'OpeningDateAsc') {
      this.sortByOpeningDate = 'OpeningDateDesc';
    } else {
      this.sortByOpeningDate = 'OpeningDateAsc';
    }
    this.loadContracts();
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
  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
  }

  openPopUp: string = "";
  toggleModalCreate(destination: string) {
    if(this.isContractEndDatePastOrToday(this.client.contract.endDate))
      {
        this.openPopUp="terminated"
      }else
      {
        this.openPopUp = destination;
   
      }
      this.serviceClient.toggleModal();
   
  }
  toggleModalClose(destination: string, ticketId: string) {
    this.serviceClient.ticketIDClosed = ticketId;
    this.openPopUp = destination;
    this.serviceClient.toggleModal();

  }
  toggleModalAddRating(destination: string, ticketId: string) {
    this.serviceClient.ticketIDClosed = ticketId;
    this.openPopUp = destination;
    this.serviceClient.toggleModalConfirmer();

  }
  closeModal() {
    this.serviceClient.closeModal();
  }
  confirmDelete(): void {
    this.serviceClient.markAsClosed(this.ticket._id).subscribe(
      (response: any) => {
        this.toggleModalAddRating("rating",this.ticket._id)
      },
      (error: any) => {
        // Handle error if needed
      }
    );
  }
  cancelDelete(): void {
    this.serviceClient.ticketIDClosed = "";
    this.closeModal()
  }

}
