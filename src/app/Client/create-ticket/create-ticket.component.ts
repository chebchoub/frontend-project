import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientServiceService } from '../service/client-service.service';

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
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService) { }
  CreateForm: FormGroup | any;
  InvalidForm: boolean = false;
  selectedImages: ImageItem[] = [];
  selectedPDFs: PDFItem[] = [];
  maxFilesError: boolean = false;
  fileSizeError: boolean = false;

  ngOnInit(): void {
    this.getClientDetails();
    this.client = this.serviceClient.clientLogedIn;
    this.CreateForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', [Validators.required]],
      priority: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      file: [''],
    });
  }
  client: any;

  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.serviceClient.clientLogedIn = client;
        });
      });
  }

  create() {
    if (!this.CreateForm.valid || this.maxFilesError || this.fileSizeError) {
      this.InvalidForm = true;
    } else {
      if (this.client.ticketsAvailable > 0) {
        const ticketRequest: any = {
          titre: this.CreateForm.controls.titre.value,
          priority: this.CreateForm.controls.priority.value,
          category: this.CreateForm.controls.category.value,
          initialComment: this.CreateForm.controls.description.value,
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
        console.log(ticketRequest)
        // Envoyer la requête au backend
        this.serviceClient.createTicket(ticketRequest, this.client.id).subscribe(
          (response: any) => {
            console.log(response);
            this.toggleModValidCreate();
          }
        );
      } else {
        this.toggleModInvalidCreate();
      }
    }
  }

  onImageChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    if (this.selectedImages.length + input.files.length > 3) {
      this.maxFilesError = true;
      return;
    }

    this.maxFilesError = false;
    this.fileSizeError = false;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type.startsWith('image/')) {
        if (file.size > 1 * 1024 * 1024) { // Limit to 1MB
          this.fileSizeError = true;
          return;
        }
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

    if (this.selectedPDFs.length + input.files.length > 3) {
      this.maxFilesError = true;
      return;
    }

    this.maxFilesError = false;
    this.fileSizeError = false;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type === 'application/pdf') {
        if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
          this.fileSizeError = true;
          return;
        }
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

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  removePDF(index: number) {
    this.selectedPDFs.splice(index, 1);
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
  showAmertCreated: boolean = false;
  showAmertInvalid: boolean = false;

  toggleModValidCreate() {
    this.showAmertCreated = true;
    this.serviceClient.toggleModalConfirmer();
    setTimeout(() => {
      this.showAmertCreated = false;
      location.reload();
    }, 2000); // 5000 milliseconds = 5 seconds, adjust as needed
  }

  toggleModInvalidCreate() {
    this.showAmertInvalid = true;
    this.serviceClient.toggleModalConfirmer();
  }

  closeModal() {
    this.serviceClient.closeModal();
  }
}
