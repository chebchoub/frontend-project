import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../../services/email-service.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { TicketServiceService } from '../../services/ticket-service.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
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
  selector: 'app-add-comment-admin',
  templateUrl: './add-comment-admin.component.html',
  styleUrls: ['./add-comment-admin.component.css']
})
export class AddCommentAdminComponent implements OnInit {
  searchText = '';
  messageForm: FormGroup | any;
  @Input() ticket: any;
  @Input() technicianImage: any;
  technicianId: string = "";

  maxFilesErrorImage: boolean = false;
  maxFilesErrorFile: boolean = false;
  fileSizeErrorImage: boolean = false;
  fileSizeErrorFile: boolean = false;

  maxFileSizeImage: number = 1 * 1024 * 1024; // 1MB
  maxFileSizePDF: number = 5 * 1024 * 1024; // 5MB
  maxFilesCount: number = 3;

  selectedImages: ImageItem[] = [];
  selectedPDFs: PDFItem[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.contractService.getPageName = 'Tickets';
    });
    this.messageForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  constructor(
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    public technicianService: ServiceTechnicianService,
    public ticketService: TicketServiceService,
    public emailService: EmailServiceService,
    private router: Router,
    public clientService: ServiceClientsService,
    private contractService: ServiceContratService
  ) { }

  tickets!: any[];

  getAllTickets(): void {
    this.ticketService.getAllTicket().subscribe(tickets => {
      this.tickets = tickets;
      this.ticket = this.tickets[0];
    });
  }

  technician: any;

  getTechnicianDetails(id: string): void {
    this.technicianService.getTechnicianById(id).subscribe(techicien => {
      this.technician = techicien;
      console.log(this.technician);
    }, error => {
      console.error('Error deleting techicien:', error);
    });
  }

  month: string = "";
  day: string = "";
  convertDateWithAbbreviation(dateString: string) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const parts = dateString.split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1]) - 1; // Convertit le mois en indice (0-based)
    const month = months[monthIndex];
    const day = parts[2];
    this.month = month;
    this.day = day;
  }

  getAllTicketByPriority(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const priority = target.value;
    if (priority === "ALL") {
      this.getAllTickets();
    } else {
      this.ticketService.getByPiority(priority).subscribe(tickets => {
        this.tickets = tickets;
        this.ticket = this.tickets[0];
      });
    }
  }

  getAllTicketByStatus(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const status = target.value;
    if (status === "ALL") {
      this.getAllTickets();
    } else {
      this.ticketService.getByStatus(status).subscribe(tickets => {
        this.tickets = tickets;
        this.ticket = this.tickets[0];
      });
    }
  }

  sortByOpeningDate: string = 'OpeningDateAsc';

  loadContracts(): void {
    if (this.sortByOpeningDate === 'OpeningDateAsc') {
      this.ticketService.getByTicketOpeningDateAsc().subscribe(tickets => {
        this.tickets = tickets;
      });
    } else if (this.sortByOpeningDate === 'OpeningDateDesc') {
      this.ticketService.getByTicketOpeningDateDesc().subscribe(tickets => {
        this.tickets = tickets;
        this.ticket = this.tickets[0];
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
      this.closeModal();
      this.router.navigate(['./homeAdmin/tickets']);
    }, error => {
      console.error('Error deleting Ticket:', error);
    });
  }

  cancelDelete(): void {
    this.ticketService.selectedTicketId = "";
    this.closeModal();
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
    this.router.navigate(['/homeAdmin/editTickets']);
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
    this.ticketService.toggleModal();
  }

  closeModal() {
    this.ticketService.closeModal();
  }

  downloadImage(image: ImageItem) {
    const link = document.createElement('a');
    link.href = image.base64Data;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPDF(pdf: PDFItem) {
    const link = document.createElement('a');
    link.href = pdf.base64Data;
    link.download = pdf.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onImageChanged(event: any) {
    this.maxFilesErrorImage = false;
    this.fileSizeErrorImage = false;

    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    if (input.files.length > this.maxFilesCount || this.selectedImages.length >= this.maxFilesCount) {
      this.maxFilesErrorImage = true;
      return;
    }

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.size > this.maxFileSizeImage) {
        this.fileSizeErrorImage = true;
        return;
      }
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageData = e.target.result;
          this.selectedImages.push({
            base64Data: imageData,
            filename: file.name,
            fileType: file.type,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      }
    }
    console.log(this.selectedImages);
  }

  onPDFChanged(event: any) {
    this.maxFilesErrorFile = false;
    this.fileSizeErrorFile = false;

    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    if (input.files.length > this.maxFilesCount || this.selectedPDFs.length >= this.maxFilesCount) {
      this.maxFilesErrorFile = true;
      return;
    }

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.size > this.maxFileSizePDF) {
        this.fileSizeErrorFile = true;
        return;
      }
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const pdfData = e.target.result;
          this.selectedPDFs.push({
            base64Data: pdfData,
            filename: file.name,
            fileType: file.type,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  removePDF(index: number) {
    this.selectedPDFs.splice(index, 1);
  }
  addComment() {
    console.log(this.messageForm.controls.comment.value !== "" || this.selectedImages.length != 0 || this.selectedPDFs.length != 0);
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
      console.log(messageRequest);
      this.ticketService.addComent(messageRequest, this.ticket._id).subscribe(
        (response: any) => {}
      );
      location.reload();
      this.cookieService.set('ticketID', this.ticket._id, 7, '/', '', true, 'Lax');
    }
  }

  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
  }
}
