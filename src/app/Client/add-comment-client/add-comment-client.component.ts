import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-add-comment-client',
  templateUrl: './add-comment-client.component.html',
  styleUrls: ['./add-comment-client.component.css']
})
export class AddCommentClientComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private formBuilder: FormBuilder, 
    private router: Router, 
    public serviceClient: ClientServiceService, 
    public sanitizer: DomSanitizer,
    private technicianService: ServiceTechnicianService
  ) {}

  messageForm: FormGroup | any;
  searchText = '';
  @Input() ticket: any;
  @Input() technicianImage: any;
  client: any;
  tickets!: any[];
  technician: any;

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
    this.getClientDetails()
    this.messageForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.serviceClient.clientLogedIn = client;
        });
      }
    );
  }

  getAllTickets(): void {
    this.serviceClient.getAllTicketByClient(this.client.id).subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  getAllTicketDesc(): void {
    console.log(this.serviceClient.clientLogedIn);
    this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe(tickets => {
      this.tickets = tickets;
      console.log(this.tickets);
      this.ticket = this.tickets[0];
    });
  }

  getTechnicianDetails(id: string): void {
    this.technicianService.getTechnicianById(id).subscribe(techicien => {
      this.technician = techicien;
      console.log(techicien);
    }, error => {
      console.error('Error deleting techicien:', error);
    });
  }

  getAllTicketByPriority(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const priority = target.value;
    if (priority === "ALL") {
      this.getAllTickets();
    } else {
      this.serviceClient.getByPiority(priority, this.client.id).subscribe(tickets => {
        this.tickets = tickets;
      });
    }
  }

  getAllTicketByStatus(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value;
    if (status === "ALL") {
      this.getAllTicketDesc();
    } else {
      this.serviceClient.getByStatus(status, this.client.id).subscribe(tickets => {
        this.tickets = tickets;
      });
    }
  }

  sortByOpeningDate: string = 'OpeningDateAsc';

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

  addComment() {
    if(this.isContractEndDatePastOrToday(this.ticket.client.contract.endDate)) {
      this.toggleModalCreate();
    } else {
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
        this.serviceClient.addComent(messageRequest, this.ticket._id).subscribe(
          (response: any) => {}
        );
        location.reload();
        this.cookieService.set('ticketID', this.ticket._id, 7, '/', '', true, 'Lax');
      }
    }
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

  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
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
  openPopUp:string=""
  toggleModalCreate() {
    this.openPopUp = "terminated";
    this.serviceClient.toggleModal();
  }

  toggleModalClose(destination: string, ticketId: string) {
    this.serviceClient.ticketIDClosed = ticketId;
    this.openPopUp = destination;
    this.serviceClient.toggleModal();
  }

  closeModal() {
    this.serviceClient.closeModal();
  }
}
