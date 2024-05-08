import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../../services/email-service.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { TicketServiceService } from '../../services/ticket-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  constructor(public ticketService: TicketServiceService, public emailService: EmailServiceService, private router: Router, public clientService: ServiceClientsService, private contractService: ServiceContratService, private formBuilder: FormBuilder) { }
  ticketId: string = "";
  ngOnInit(): void {
    this.ticketId = this.ticketService.selectedTicketId;
    console.log(this.ticketId)
    this.getTicketDetails();
    this.TicketForm = this.formBuilder.group({
      titre:['', Validators.required],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
    })
  }
  ticket: any;
  TicketForm: FormGroup | any;
  getTicketDetails(): void {
    this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      console.log(ticket)
      this.TicketForm?.patchValue({
        titre: ticket.titre,
        priority: ticket.priority,
        category: ticket.category,
        description: ticket.comments[0].comment
      });

    });
  }
  getAllTickets(): void {
    this.ticketService.getAllTicket().subscribe(tickets => {

  
    });
  }
  submitForm(): void {
  
    const updatedTicket = this.TicketForm.value;
    this.ticket.titre=this.TicketForm.value.titre;
    this.ticket.category=this.TicketForm.value.category;
    this.ticket.priority=this.TicketForm.value.priority;
    this.ticket.description=this.TicketForm.value.description;
    this.ticketService.editTicket(this.ticket, this.ticket._id).subscribe(() => {
      console.log('ticket updated successfully.');
      this.closeModal();
      this.getAllTickets()
      this.router.navigate(['/homeAdmin/tickets']);
      // Mettre à jour la liste des tickets après la modification réussie
     
    }, error => {
      console.error('Error ticket contract:', error);
      // Gérer les erreurs de mise à jour du ticket ici
    });
}
  closeModal() {
    this.ticketService.closeModal();
    this.router.navigate(['/homeAdmin/tickets']);
  }
  openPopUp:string="";
  validateTicket(): boolean {
    return (
      this.TicketForm.controls.titre.valid &&
      this.TicketForm.controls.priority.valid &&
      this.TicketForm.controls.category.valid &&
      this.TicketForm.controls.description.valid
    );
  }
  toggleModalUpdate(destination: string) {
    if (this.validateTicket())
    {
        this.openPopUp = destination;
        this.ticketService.toggleModalConfirmer();
    }else {
      this.TicketForm.markAllAsTouched();
    }
  
}
closeModalConfimer() {
  this.ticketService.closeModalConfimer();
}
}
