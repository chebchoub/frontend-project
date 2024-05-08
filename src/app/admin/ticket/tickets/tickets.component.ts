import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../../services/email-service.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { TicketServiceService } from '../../services/ticket-service.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit{
  searchText='';
  messageForm: FormGroup | any;

  ngOnInit(): void {
    this.ticketService.getByTicketOpeningDateDesc().subscribe(tickets => {
      this.tickets = tickets;
      this.ticket=this.tickets[0]
    });
    setTimeout(() => {
      this.contractService.getPageName = 'Tickets';
    }); 
    this.messageForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    }); }
  constructor(private formBuilder: FormBuilder,public technicianService: ServiceTechnicianService,public ticketService:TicketServiceService,public emailService:EmailServiceService,private router: Router, public clientService: ServiceClientsService,private contractService:ServiceContratService) { }
  tickets!: any[];

  currentPage: number = 0;
  pageSize: number = 4; // Nombre de contrats par page
  calculateRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.tickets.length);
    return { start, end };
  }
  getTotalPages(): number {
    return Math.ceil(this.tickets.length / this.pageSize);
  }
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.tickets.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  } 
  getAllTickets(): void {
    this.ticketService.getAllTicket().subscribe(tickets => {

      this.tickets = tickets;

      this.ticket=this.tickets[0]

    });
  }
  ticket:any;

  getTicketDetails(id:string): void {
    this.ticketService.getTicketById(id).subscribe(ticket => {
    
      this.ticket=ticket;

    });
  }
  month:string="";
  day:string="";
  convertDateWithAbbreviation(dateString: string) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const parts = dateString.split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1]) - 1; // Convertit le mois en indice (0-based)
    const month = months[monthIndex];
    const day = parts[2];
    this.month=month;
    this.day=day;
}
getAllTicketByPriority(event: Event): void {
  const target = event.target as HTMLSelectElement; // Conversion de type explicite
  const priority = target.value;
  if (priority === "ALL") {
    this.getAllTickets(); // Méthode pour récupérer tous les contrats


  } else {
    
    this.ticketService.getByPiority(priority).subscribe(tickets => {
      this.tickets = tickets;
      this.ticket=this.tickets[0]

    
    });
  }
}
getAllTicketByStatus(event: Event): void {
  const target = event.target as HTMLSelectElement; // Conversion de type explicite
  const status = target.value;
  if (status === "ALL") {
    this.getAllTickets(); // Méthode pour récupérer tous les contrats


  } else {
    
    this.ticketService.getByStatus(status).subscribe(tickets => {
      this.tickets = tickets;
      this.ticket=this.tickets[0]

    
    });
  }
}
sortByOpeningDate: string = 'OpeningDateAsc'; // Pour stocker le type de tri

loadContracts(): void {

  if (this.sortByOpeningDate === 'OpeningDateAsc') {
    this.ticketService.getByTicketOpeningDateAsc().subscribe(tickets => {
      this.tickets = tickets;

    });
  } else if (this.sortByOpeningDate === 'OpeningDateDesc') {
    this.ticketService.getByTicketOpeningDateDesc().subscribe(tickets => {
      this.tickets = tickets;
      this.ticket=this.tickets[0]

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
confirmDelete(): void {
  this.ticketService.deleteTicket(this.ticketService.selectedTicketId).subscribe(() => {
    console.log('Ticket deleted successfully.');
    this.getAllTickets();
    this.closeModal()
    this.router.navigate(['./homeAdmin/tickets',]);

  }, error => {
    console.error('Error deleting Ticket:', error);
  });
}
cancelDelete(): void {
  this.ticketService.selectedTicketId = "";
  this.closeModal()
}
openPopUp: string = "";
toggleModalview(destination: string, idTicket: string) {
  this.openPopUp = destination;
  this.ticketService.selectedTicketId = idTicket;
  this.ticketService.toggleModal();
}
toggleModalEdit(destination: string, idTicket: string) {
  this.openPopUp = destination;
  this.ticketService.selectedTicketId = idTicket;
  // Naviguer vers la nouvelle URL avec l'ID du contrat
  this.router.navigate(['/homeAdmin/editTickets']);

  // Afficher le popup
  this.ticketService.toggleModal();
} 
toggleModalAssigned(destination: string, idTicket: string) {
  this.openPopUp = destination;
  this.technicianService.selectedTicketId = idTicket;
  this.ticketService.toggleModal();
}
toggleModalDelete(destination: string, idTicket: string) {
  this.openPopUp = destination;
  this.ticketService.selectedTicketId = idTicket;
  // Naviguer vers la nouvelle URL avec l'ID du contrat
  // Afficher le popup
  this.ticketService.toggleModal();
}
closeModal() {
  this.ticketService.closeModal();
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
selectedImages: ImageItem[] = [];
  selectedPDFs: PDFItem[] = [];
  onImageChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageData = e.target.result; // Récupérer les données sous forme de base64
          this.selectedImages.push({
            base64Data: imageData,
            filename: file.name,
            fileType: file.type,
            size: file.size
          });
        };
        reader.readAsDataURL(file); // Commencer la lecture du fichier en tant que base64
      }
    }


    console.log(this.selectedImages);
  }

  onPDFChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const pdfData = e.target.result; // Récupérer les données sous forme de base64
          this.selectedPDFs.push({
            base64Data: pdfData,
            filename: file.name,
            fileType: file.type,
            size: file.size
          });
        };
        reader.readAsDataURL(file); // Commencer la lecture du fichier en tant que base64
      }
    }
  }
  addComment() {
    console.log(this.messageForm.controls.comment.value !== "" || this.selectedImages.length != 0 || this.selectedPDFs.length != 0)
    if (this.messageForm.controls.comment.value !== "" || this.selectedImages.length != 0 || this.selectedPDFs.length != 0) {
      const messageRequest: any = {
        comment: this.messageForm.controls.comment.value,
        images: this.selectedImages.map(image => ({
          base64Data: image.base64Data,
          filename: image.filename,
          fileType: image.fileType,
          size: image.size
        })),
        files: this.selectedPDFs.map(pdf => ({
          base64Data: pdf.base64Data,
          filename: pdf.filename,
          fileType: pdf.fileType,
          size: pdf.size
        }))
      };
      console.log(messageRequest)
      // Envoyer la requête au backend
      this.ticketService.addComent(messageRequest, this.ticket._id).subscribe(
        (response: any) => {
        }
      );

    }
    location.reload();

  }

}
