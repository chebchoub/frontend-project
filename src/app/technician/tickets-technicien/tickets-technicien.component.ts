import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  selector: 'app-tickets-technicien',
  templateUrl: './tickets-technicien.component.html',
  styleUrl: './tickets-technicien.component.css'
})
export class TicketsTechnicienComponent implements OnInit{
  
  constructor(public technicienService:ServiceTechnicianService,public userService:UserServiceService,private formBuilder: FormBuilder,private router: Router)
  {

  }
  ngOnInit(): void {
    this.technicienService.getPageName = "Tickets";

    this.getTechnicianDetails()

  }
 technician:any;
 tickets!:any[];
 ticket:any;
  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technician=technician;
          this.tickets=technician.ticketWaitingList;
          this.ticket=technician.ticketWaitingList[0];
          this.technicienService.technicianLogedIn=technician;
         });
      });
  }
  getTicketDetails(id:string): void {
    this.technicienService.getTicketById(id).subscribe(ticket => {
    
      this.ticket=ticket;

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
  searchText='';
  messageForm: FormGroup | any;

}
