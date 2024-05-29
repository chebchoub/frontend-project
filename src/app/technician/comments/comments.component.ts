import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  constructor(private datePipe: DatePipe, public technicienService: ServiceTechnicianService, private cookieService: CookieService, public userService: UserServiceService, private formBuilder: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) { }

  @Input() ticket: any;

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
    this.messageForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  technician: any;

  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technicienService.technicianLogedIn = technician;
        });
      }
    );
  }

  tickets!: any[];

  getAllTickets(): void {
    this.technicienService.getAllTicketWaitingList(this.technician.id).subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  getTicketDetails(idTicket: string): void {
    this.technicienService.getTicketById(idTicket, this.technician.id).subscribe(ticket => {
      this.ticket = ticket;
    });
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
      this.technicienService.addComent(messageRequest, this.ticket._id).subscribe(
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

  searchText = '';
  messageForm: FormGroup | any;
}
