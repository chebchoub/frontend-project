import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceTechnicianService } from '../services/service-technician.service';
import { TicketServiceService } from '../services/ticket-service.service';
import { EmailServiceService } from '../services/email-service.service';
import { ServiceClientsService } from '../services/service-clients.service';
import { ServiceContratService } from '../services/service-contrat.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  [x: string]: any;
  constructor(
    public technicianService: ServiceTechnicianService,
    public ticketService: TicketServiceService,
    public emailService: EmailServiceService,
    private router: Router,
    public clientService: ServiceClientsService,
    private contractService: ServiceContratService
  ) { }

  today: Date = new Date();
  chart: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options; // Déclarer chartOptions comme une propriété de la classe
  chartOptions2: any;
  ngOnInit(): void {
    setTimeout(() => {
      this.contractService.getPageName = 'DASHBOARD';
    });

    this.getAllClients();
    this.getAllContracts();
    this.getAllTechnician();
    this.getAllTickets();
    this.getAllTicketByStatus("IN_PROGRESS")
    this.getAllTicketByStatus("NEW")

    this.getByTicketOpeningDateInLastWeek()
    this.contractService.getCountByPremiumType('SILVER').subscribe(countSilver => {
      this.contractService.getCountByPremiumType('GOLD').subscribe(countGold => {
        this.contractService.getCountByPremiumType('PLATINIUM').subscribe(countPLATINIUM => {

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
                innerSize: '99%',
                borderWidth: 15,
                borderColor: '',
                slicedOffset: 10,

              }
            },
            title: {
              text: ''
            },
            credit: {
              enabled: false
            },
            series: [{
              name: 'Contracts',
              data: [
                { name: 'Platinium', y: countPLATINIUM, color: 'rgb(213, 156, 255)' },

                { name: 'Silver', y: countSilver, color: 'rgb(204, 204, 204)' },
                { name: 'Gold', y: countGold, color: 'rgb(255, 239, 138)' },
              ]
            }]
          };

          this.chartOptions2 = options;

          this.chartOptions2 = options;
        });
      });
    });
  }
  getByTicketOpeningDateInLastWeek(): void {
    this.ticketService.getByTicketOpeningDateInLastWeek("HIGH").subscribe(
      ticketCountsHIGH => {
        this.ticketService.getByTicketOpeningDateInLastWeek("MEDIUM").subscribe(
          ticketCountsMEDIUM => {
            this.ticketService.getByTicketOpeningDateInLastWeek("LOW").subscribe(
              ticketCountsLOW => {
                // Obtenez les sept derniers jours
                const lastSevenDays = [];
                for (let i = 6; i >= 0; i--) {
                  const day = new Date(this.today);
                  day.setDate(this.today.getDate() - i);
                  lastSevenDays.push(day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                }

                // Créez le nouvel objet xAxis avec les sept derniers jours
                const xAxis: Highcharts.XAxisOptions = {
                  categories: lastSevenDays
                };

                // Remplissez les séries avec les données des tickets par priorité
                this.chartOptions = {
                  title: {
                    text: '',

                  },
                  xAxis: xAxis,
                  yAxis: {
                    title: {
                      text: 'Number of Tickets'
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    valueSuffix: ' Tickets'
                  },
                  legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                  },
                  series: [{
                    name: 'HIGH',
                    type: 'line',
                    color: 'red', // Couleur rouge pour HIGH

                    data: ticketCountsHIGH
                  },
                  {
                    name: 'MEDIUM',
                    type: 'line',
                    color: 'rgb(202,138,4)', // Couleur rouge pour HIGH

                    data: ticketCountsMEDIUM
                  },
                  {
                    name: 'LOW',
                    type: 'line',
                    color: 'rgb(13,148,136)', // Couleur rouge pour HIGH

                    data: ticketCountsLOW
                  }]
                };
              }

            );
          }
        );
      }
    );
  }

  ticketsHIGH: any[] = [];
  ticketsLow: any[] = [];
  ticketsMEDIUM: any[] = [];


  getAllTicketByPriority(priority: string): void {
    this.ticketService.getByPiority(priority).subscribe(tickets => {

      if (priority === "HIGH") {
        this.ticketsHIGH = tickets;
      }
      else if (priority === "Low") {
        this.ticketsLow = tickets;

      }
      else {
        this.ticketsMEDIUM = tickets;

      }
    });

  }
  clients!: any[];
  getAllClients(): void {
    this.clientService.getAllClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  contracts: any[] = [];
  getAllContracts(): void {
    this.contractService.getAllContracts().subscribe(contracts => {
      this.contracts = contracts;
    });
  }

  technicians: any[] = [];
  getAllTechnician(): void {
    this.technicianService.getAllTechnician().subscribe(technicians => {
      this.technicians = technicians;
    });
  }

  tickets: any[] = [];
  getAllTickets(): void {
    this.ticketService.getAllTicket().subscribe(tickets => {
      this.tickets = tickets;
    });
  } sortByTicketAvailabel: string = 'TicketsAsc'; // Pour stocker le type de tri

  loadContracts(): void {

    if (this.sortByTicketAvailabel === 'TicketsAsc') {
      this.clientService.getByTicketsAvailableAsc().subscribe(clients => {
        this.clients = clients;
      });
    } else if (this.sortByTicketAvailabel === 'TicketsDesc') {
      this.clientService.getByTicketsAvailableDesc().subscribe(clients => {
        this.clients = clients;
      });
    }
  }
  sortByTicketsAvailabel(): void {
    if (this.sortByTicketAvailabel === 'TicketsAsc') {
      this.sortByTicketAvailabel = 'TicketsDesc';
    } else {
      this.sortByTicketAvailabel = 'TicketsAsc';
    }
    this.loadContracts();
  }
  TicketByStatusIN_PROGRESSlengthh: number = 0;
  TicketByStatusIN_NEWlengthh: number = 0;

  getAllTicketByStatus(status: string): void {
    this.ticketService.getByStatus(status).subscribe(tickets => {
      if (status === "IN_PROGRESS") {
        this.TicketByStatusIN_PROGRESSlengthh = tickets.length;
      } else {
        this.TicketByStatusIN_NEWlengthh = tickets.length;

      }

    });

  }
  openPopUp: string = "";

  toggleModalview(destination: string, idContract: string) {
    this.openPopUp = destination;
    this.clientService.selectedClientId = idContract;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    // Afficher le popup
    this.clientService.toggleModal();
  }

}
