import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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

  constructor(private route: ActivatedRoute,public technicienService: ServiceTechnicianService, public userService: UserServiceService, private cookieService: CookieService,private formBuilder: FormBuilder, private router: Router) {

  }
  ngOnInit(): void {

    this.technicienService.getPageName = "Tickets";
    this.getTechnicianDetails()
    this.technician=this.technicienService.technicianLogedIn;

     this.getAllTicketDesc()
  
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
    this.technicienService.getTickets(this.technician.id).subscribe(tickets => {
      this.tickets = tickets;
      let ticketId=this.cookieService.get('ticketID');
      
        console.log(this.tickets[0]._id)
        console.log(ticketId)
      if(ticketId!=="")        
        {       

          this.getTicketDetails(ticketId||"")     
          this.cookieService.set('ticketID', '', 7, '/', '', true, 'Lax');

        }else
        {
          this.ticket=this.tickets[0]
        }
  

    });
  }
    getTicketDetails(idTicket: string): void {
    this.technicienService.getTicketById(idTicket, this.technician.id).subscribe(ticket => {
      this.ticket = ticket;

    });
  }
  getAllTicketDesc(): void {
    this.technicienService.getByTicketOpeningDateDesc(this.technician.id).subscribe(tickets => {
      this.tickets = tickets;
      let ticketId=this.cookieService.get('ticketID');
      
        console.log(this.tickets[0]._id)
        console.log(ticketId)
      if(ticketId!=="")        
        {       

          this.getTicketDetails(ticketId||"")       

        }else
        {
          this.ticket=this.tickets[0]
        }

    });
  }
  getAllTicketByPriority(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const priority = target.value;
    if (priority === "ALL") {
      this.getAllTickets(); // Méthode pour récupérer tous les contrats

    } else {

      this.technicienService.getByPiority(priority, this.technician.id).subscribe(tickets => {
        this.tickets = tickets;

      });
    }
  }

  getAllTicketByStatus(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const status = target.value;
    if (status === "ALL") {
      this.getAllTickets(); // Méthode pour récupérer tous les contrats

    } else {

      this.technicienService.getByStatus(status, this.technician.id).subscribe(tickets => {
        this.tickets = tickets;

      });
    }
  }
  sortByOpeningDate: string = 'OpeningDateAsc'; // Pour stocker le type de tri

  loadContracts(): void {

    if (this.sortByOpeningDate === 'OpeningDateAsc') {
      this.technicienService.getByTicketOpeningDateAsc(this.technician.id).subscribe(tickets => {
        this.tickets = tickets;
      });
    } else if (this.sortByOpeningDate === 'OpeningDateDesc') {
      this.technicienService.getByTicketOpeningDateDesc(this.technician.id).subscribe(tickets => {
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


  searchText = '';
  messageForm: FormGroup | any;

}
