import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketRequest } from '../dto/ticket-request';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Document, Packer, Paragraph, TextRun, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import { ServiceTechnicianService } from '../../admin/services/service-technician.service';
interface WordItem {
  base64Data: string;
  filename: string;
  fileType: string;
  size: number;
}
@Component({
  selector: 'app-rating-ticket',
  templateUrl: './rating-ticket.component.html',
  styleUrl: './rating-ticket.component.css'
})
export class RatingTicketComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer,private technicianService:ServiceTechnicianService) { }
  ratingForm: FormGroup | any;
  @Output() closeModalEvent = new EventEmitter<void>();

  ngOnInit(): void {
    // Initialize form group with FormBuilder
    this.ratingForm = this.formBuilder.group({
      rating: ['', Validators.required]
    });
    // Listen for changes in the rating form control
    this.ratingForm.get('rating').valueChanges.subscribe((value: any) => {
      if (value) {
        this.rateTechnician(value);

      }
    });
    this.getTicketDetails(this.serviceClient.ticketIDClosed)
  }
  ratingValue: number = 0;
  wordItem!: WordItem ;
  // Method to submit the rating to the backend
  rateTechnician(value: number) {

    this.serviceClient.addRating(value, this.serviceClient.ticketIDClosed).subscribe(
      (response: any) => {
        if(response==null)
          {
            this.generateWordFile()
          
            setTimeout(() => {
              location.reload();
            }, 1000);
          }        
       
      },
      (error: any) => {
        console.log(error)      

      }
    );

  }
  ticket:any;
  technician:any;
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
       
      },
      (error) => {
        console.error('Error deleting technician:', error);
      }
    );
  }
  generateWordFile(): void {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Ticket Closure Report', bold: true, size: 40 })],
            }),
            new Paragraph({
              children: [
                new TextRun(`Ticket ID: ${this.ticket._id}`),
                new TextRun('\n'),
                new TextRun(`Title: ${this.ticket.title}`),
                new TextRun('\n'),
                new TextRun(`openingDate: ${this.ticket.openingDate}`),
                new TextRun('\n'),
                new TextRun(` priority: ${this.ticket.priority}`),
                new TextRun('\n'),
                new TextRun(`category: ${this.ticket.category}`),
                new TextRun('\n'),
                new TextRun({ text: `Resolved by : ${this.technician.firstName + ' ' + this.technician.lastName}"`, bold: true }),
                new TextRun('\n'),
                new TextRun({ text: `Closed by: ${this.ticket.client.contract.entreprise}`, bold: true }),
                new TextRun('\n'),
                new TextRun(`Date: ${new Date(this.ticket.closingDate).toLocaleDateString()}`),
                new TextRun('\n\n'),
                new TextRun('\n'),
              ],
            }),
            ...this.ticket.images.map((image: any) => new Paragraph({
              children: [
                new ExternalHyperlink({
                  link: image.base64Data,
                  children: [new TextRun({ text: image.filename, style: "Hyperlink" })],
                }),
                new TextRun('\n'),
              ],
            })),
            new Paragraph({
              children: [
                new TextRun({ text: 'Comments:', bold: true, size: 30 }),
                new TextRun('\n'),
              ],
            }),
            ...this.ticket.comments.map((comment: any) => new Paragraph({
              children: [
                new TextRun({ text: `${comment.commenterName}`, bold: true }),
                new TextRun('\n'),
                new TextRun(` ${new Date(comment.timestamp).toLocaleDateString()}`),
                new TextRun('\n'),
                new TextRun(` -${comment.comment}`),
                new TextRun('\n'),
              ],
            })),
            new Paragraph({
              children: [new TextRun('The ticket has been successfully closed.')],
            }),
          ],
        },
      ],
    });
    Packer.toBlob(doc).then((blob: Blob) => {
      saveAs(blob, `Ticket_${this.ticket._id}_Closed.docx`);
    });
    Packer.toBlob(doc).then((blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const wordItem: WordItem = {
          base64Data: base64data.split(',')[1], // Remove the "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," part
          filename: `Ticket_${this.ticket._id}_Closed.docx`,
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: blob.size
        };
        console.log(wordItem);
  
        // Envoyer l'objet `wordItem` au backend
        this.serviceClient.addRapport(wordItem, this.serviceClient.ticketIDClosed).subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            console.log(error);
          }
        );
      };
    });
  }
  
  closeModal() {
    this.generateWordFile()

    this.serviceClient.closeModalConfimer();
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}
