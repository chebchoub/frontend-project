import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {

  constructor(public technicienService: ServiceTechnicianService, public userService: UserServiceService, private formBuilder: FormBuilder, private router: Router,private cdr: ChangeDetectorRef) {

  }
  @Input() ticket: any;

  ngOnInit(): void {
    
    console.log(this.ticket)
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
      });

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
    console.log(this.messageForm.controls.comment.value)
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
      this.technicienService.addComent(messageRequest, this.ticket._id).subscribe(
        (response: any) => {
        }
      );
      this.ticket = { ...this.ticket }; // Mettre à jour la référence du ticket
      this.cdr.detectChanges(); // Détecter manuellement les modification    
  }
}

  searchText = '';
  messageForm: FormGroup | any;

}
