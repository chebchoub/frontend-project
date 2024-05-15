import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketRequest } from '../dto/ticket-request';
import { ClientServiceService } from '../service/client-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})
export class DashboardClientComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, public serviceClient: ClientServiceService, public sanitizer: DomSanitizer) { }
  messageForm: FormGroup | any;
  searchText = '';
  chart: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options; // Déclarer chartOptions comme une propriété de la classe
  chartOptions2: any;
  chartOptions1: any;

  ngOnInit(): void {
    this.serviceClient.getPageName = "Dashboard";
    this.getClientDetails()
    this.client = this.serviceClient.clientLogedIn;
    this.getAllTicketByStatus("NEW")
    this.getAllTicketByStatus("IN_PROGRESS")
    this.getAllTicketByStatus("RESOLVED")
    this.getAllTicketByStatus("CLOSED")
    this.getAllTicketByPriority()
    this.getAllTicketBycategory()
    this.getAllTicketDesc()
    

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
  tickets!: any[];
  ticketAvailabelPourcentage:number=0;
  getAllTickets(): void {
    this.serviceClient.getAllTicketByClient(this.client.id).subscribe(tickets => {
      this.tickets = tickets;

    });
  }
  getAllTicketDesc(): void {
    console.log(this.serviceClient.clientLogedIn)
    this.serviceClient.getByTicketOpeningDateDesc(this.client.id).subscribe(tickets => {
      this.tickets = tickets;
      this.ticketAvailabelPourcentage=(((this.client.contract.tickets-this.client.ticketsAvailable)/this.client.contract.tickets)*100)
    });
  }
  ticket: any;

  getTicketDetails(ticketId: string): void {
    this.serviceClient.getTicketById(ticketId).subscribe(ticket => {

      this.ticket = ticket;
      console.log(this.ticket)

    });
  }

  getAllTicketByPriority(): void {
    
      this.serviceClient.getByPiority("LOW", this.client.id).subscribe(ticketsLOW => {
        this.serviceClient.getByPiority("MEDIUM", this.client.id).subscribe(ticketsMEDIUM => {
          this.serviceClient.getByPiority("HIGH", this.client.id).subscribe(ticketsHIGH => {
            const options = {
              chart: {
                type: 'pie',
                plotShadow: false
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                pie: {
                  innerSize: '80%',
                  borderWidth: 10,
                  borderColor: '',
                  slicedOffset:0,
    
                }
              },
              title: {
                text: ''
              },
              credit: {
                enabled: false
              },
              series: [{
                name: 'tickets',
                data: [
                     { name: 'LOW', y: ticketsLOW.length, color: 'rgb(76, 175, 20)' },
    
                  { name: 'MEDIUM', y:ticketsMEDIUM.length, color: 'rgb(255, 193, 7)' },
                  { name: 'HIGH', y: ticketsHIGH.length, color: 'rgb(244, 67, 54)' },
                ]
              }]
            };
    
            this.chartOptions2 = options;
    
   
          });
   
        });
   
      });
   
  }
  getAllTicketBycategory(): void {
    const colors = {
      INFRASTRUCTURE: '#7cb5ec', // Bleu clair
      SECURITY: '#90ed7d', // Vert clair
      ADMINISTRATION: '#f7a35c', // Orange clair
      DEVELOPMENT: '#8085e9', // Violet clair
    };
    this.serviceClient.getByCategory("INFRASTRUCTURE", this.client.id).subscribe(ticketsINFRASTRUCTURE => {
      this.serviceClient.getByCategory("SECURITY", this.client.id).subscribe(ticketsSECURITY => {
        this.serviceClient.getByCategory("ADMINISTRATION", this.client.id).subscribe(ticketsADMINISTRATION => {
          this.serviceClient.getByCategory("DEVELOPMENT", this.client.id).subscribe(ticketsDEVELOPMENT => {

            const options = {
              chart: {
                type: 'pie',
                plotShadow: false
              },
              credits: {
                enabled: false
              },
              plotOptions: {
                pie: {
                  innerSize: '80%',
                  borderWidth: 10,
                  borderColor: '',
                  slicedOffset:0,
    
                }
              },
              title: {
                text: ''
              },
              credit: {
                enabled: false
              },
              series: [{
                name: 'tickets',
                data: [
                  { name: 'INFRASTRUCTURE', y: ticketsINFRASTRUCTURE.length, color: colors.INFRASTRUCTURE },
                  { name: 'SECURITY', y: ticketsSECURITY.length, color: colors.SECURITY },
                  { name: 'ADMINISTRATION', y: ticketsADMINISTRATION.length, color: colors.ADMINISTRATION },
                  { name: 'DEVELOPMENT', y: ticketsDEVELOPMENT.length, color: colors.DEVELOPMENT },
                ]
              }]
            };
    
            this.chartOptions1= options;
  
 
          });
  
 
        });
 
      });
 
    });
 
}
  nbrNewTicket: number = 0;
  nbrIN_PROGRESSTicket: number = 0;
  nbrRESOLVEDTicket: number = 0;
  nbrCLOSEDTicket: number = 0;
  getAllTicketByStatus(status: string): void {

    this.serviceClient.getByStatus(status, this.client.id).subscribe(tickets => {
      if (status === "NEW") {
        this.nbrNewTicket = tickets.length;
      }
      else if (status === "IN_PROGRESS") {
        this.nbrIN_PROGRESSTicket = tickets.length;

      } else if (status === "CLOSED") {
        this.nbrRESOLVEDTicket = tickets.length;
      }
    });

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




}