import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketRequest } from '../dto/ticket-request';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer } from '@angular/platform-browser';
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
  styleUrls: ['./tickets-client.component.css']
})
export class TicketsClientComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public serviceClient: ClientServiceService,
    public sanitizer: DomSanitizer,
    private technicianService: ServiceTechnicianService
  ) {}

  messageForm!: FormGroup;
  searchText = '';
  client: any;
  tickets!: any[];
  ticket: any;
  technicianImage = '';
  technician: any;
  openPopUp = '';
  sortByOpeningDate = 'OpeningDateAsc';
  selectedImages: ImageItem[] = [];
  selectedPDFs: PDFItem[] = [];

  ngOnInit(): void {
    this.serviceClient.getPageName = 'Tickets';
    this.getClientDetails();
    this.client = this.serviceClient.clientLogedIn;
    this.getAllTicketDesc();
    this.messageForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe((response) => {
      this.serviceClient.getClientByEmail(response).subscribe((client) => {
        this.serviceClient.clientLogedIn = client;
      });
    });
  }

  getAllTickets(): void {
    this.serviceClient.getAllTicketByClient(this.client.id).subscribe((tickets) => {
      this.tickets = tickets;
      this.ticket = this.tickets[0];
    });
  }

  getAllTicketDesc(): void {
    this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe((tickets) => {
      this.tickets = tickets;
      const ticketId = this.cookieService.get('ticketID');
      if (ticketId !== '') {
        this.getTicketDetails(ticketId);
      } else {
        this.ticket = this.tickets[0];
        this.getTechnicianDetails(this.ticket.technicianId);
      }
    });
  }

  getTicketDetails(ticketId: string): void {
    this.serviceClient.getTicketById(ticketId).subscribe((ticket) => {
      this.ticket = ticket;
      this.getTechnicianDetails(this.ticket.technicianId);
    });
  }

  getTechnicianDetails(id: string): void {
    this.technicianService.getTechnicianById(id).subscribe(
      (techicien) => {
        this.technician = techicien;
        this.technicianImage = techicien.profilePhoto;
      },
      (error) => {
        console.error('Error deleting technician:', error);
      }
    );
  }

  getAllTicketByPriority(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const priority = target.value;
    if (priority === 'ALL') {
      this.getAllTickets();
    } else {
      this.serviceClient.getByPiority(priority, this.client.id).subscribe((tickets) => {
        this.tickets = tickets;
        this.ticket=tickets[0]

      });
    }
  }

  getAllTicketByStatus(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value;
    if (status === 'ALL') {
      this.getAllTicketDesc();
    } else {
      this.serviceClient.getByStatus
      (status, this.client.id).subscribe((tickets) => {
        this.tickets = tickets;
        this.ticket=tickets[0]

      });
    }
  }

  loadContracts(): void {
    if (this.sortByOpeningDate === 'OpeningDateAsc') {
      this.serviceClient.getByTicketOpeningDateAsc(this.client.id).subscribe((tickets) => {
        this.tickets = tickets;
        this.ticket=tickets[0]
      });
    } else if (this.sortByOpeningDate === 'OpeningDateDesc') {
      this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe((tickets) => {
        this.tickets = tickets;
        this.ticket=tickets[0]

      });
    }
  }

  sortTiketByOpeningDate(): void {
    this.sortByOpeningDate = this.sortByOpeningDate === 'OpeningDateAsc' ? 'OpeningDateDesc' : 'OpeningDateAsc';
    this.loadContracts();
  }

  downloadImage(image: ImageItem): void {
    const link = document.createElement('a');
    link.href = image.base64Data;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF(pdf: PDFItem): void {
    const link = document.createElement('a');
    link.href = pdf.base64Data;
    link.download = pdf.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
  }

  toggleModalCreate(destination: string): void {
    if (this.isContractEndDatePastOrToday(this.client.contract.endDate)) {
      this.openPopUp = 'terminated';
    } else {
      this.openPopUp = destination;
    }
    this.serviceClient.toggleModal();
  }

  toggleModalClose(destination: string, ticketId: string): void {
    this.serviceClient.ticketIDClosed = ticketId;
    this.openPopUp = destination;
    this.serviceClient.toggleModal();
  }

  toggleModalAddRating(destination: string, ticketId: string): void {
    this.serviceClient.ticketIDClosed = ticketId;
    this.openPopUp = destination;
    this.serviceClient.toggleModalConfirmer();
  }

  closeModal(): void {
    this.serviceClient.closeModal();
  }

  confirmDelete(): void {
    this.serviceClient.markAsClosed(this.ticket._id).subscribe(
      (response: any) => {
        if(this.ticket.technicianId!=null)
          {
            this.toggleModalAddRating("rating",this.ticket._id)

          }
          else{
            this.cancelDelete()
            setTimeout(() => {
              location.reload();
            }, 1000);
          }
      },
      (error: any) => {
        // Handle error if needed
      }
    );
  }

  cancelDelete(): void {
    this.serviceClient.ticketIDClosed = '';
    this.closeModal();
  }

  calculateTimeDifference(createdAt: string): string {
    const notificationDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - notificationDate.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays > 0) {
      return `${differenceInDays} days ago`;
    } else if (differenceInHours > 0) {
      return `${differenceInHours} hours ago`;
    } else if (differenceInMinutes > 0) {
      return `${differenceInMinutes} minutes ago`;
    } else {
      return 'a few moments ago';
    }
  }
  getDownloadLink(fileType:string,base64Data:string): string {
    return `data:${fileType};base64,${base64Data}`;
  }


}
