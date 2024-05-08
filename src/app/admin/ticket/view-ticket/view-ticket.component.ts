import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../../services/email-service.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { TicketServiceService } from '../../services/ticket-service.service';


@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {
  constructor(public ticketService:TicketServiceService,public emailService:EmailServiceService,private router: Router, public clientService: ServiceClientsService,private contractService:ServiceContratService) { }
  ticketId:string="";
  ngOnInit(): void {
    this.ticketId = this.ticketService.selectedTicketId;
    this.getTicketDetails()
  }
  ticket:any;

  getTicketDetails(): void {
    this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
    
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
closeModal() {
  this.ticketService.closeModal();
}
}
