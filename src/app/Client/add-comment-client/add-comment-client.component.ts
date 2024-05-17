import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketRequest } from '../dto/ticket-request';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ServiceTechnicianService } from '../../admin/services/service-technician.service';
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
  styleUrl: './add-comment-client.component.css'
})
export class AddCommentClientComponent implements OnInit {
  constructor(private cookieService: CookieService,private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer,private technicianService:ServiceTechnicianService) { }
  messageForm: FormGroup | any;
  searchText = '';
  @Input() ticket: any;
  @Input() technicianImage: any;

  ngOnInit(): void {
    this.getClientDetails()
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


    });
  }
  getAllTicketDesc(): void {
    console.log( this.serviceClient.clientLogedIn)
    this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe(tickets => {
      this.tickets = tickets;
      console.log(this.tickets)
      this.ticket = this.tickets[0]
    });
  }


  technician:any;

  getTechnicianDetails(id:string): void {
    this.technicianService.getTechnicianById(id).subscribe(techicien => {
      this.technician=techicien;
      console.log(techicien)
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
      this.serviceClient.addComent(messageRequest, this.ticket._id).subscribe(
        (response: any) => {

        }
      );
      location.reload() 
      this.cookieService.set('ticketID', this.ticket._id, 7, '/', '', true, 'Lax');
    }
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
  openPopUp: string = "";
  toggleModalCreate(destination: string) {
    this.openPopUp = destination;
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
