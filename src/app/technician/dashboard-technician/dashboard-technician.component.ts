import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
@Component({
  selector: 'app-dashboard-technician',
  templateUrl: './dashboard-technician.component.html',
  styleUrl: './dashboard-technician.component.css'
})
export class DashboardTechnicianComponent implements OnInit{

  constructor(private route: ActivatedRoute,public technicienService: ServiceTechnicianService, public userService: UserServiceService, private cookieService: CookieService,private formBuilder: FormBuilder, private router: Router) {

  }
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options; // Déclarer chartOptions comme une propriété de la classe
  chartOptions2: any;
  chartOptions1: any;
 ngOnInit(): void {
  this.technicienService.getPageName = "dashboard";
  this.getTechnicianDetails()
  this.technician=this.technicienService.technicianLogedIn;
   this.getAllTicketDesc()
   this.getAllTicket()
   this.getAllTicketByStatus("NEW")
   this.getAllTicketByStatus("IN_PROGRESS")
   this.getAllTicketByStatus("RESOLVED")
   this.getAllTicketByStatus("CLOSED")
  this.getAllTicketByPriority()
  this.getAllTicketBycategory()
 }
 tickets!:any[];
 getAllTicketDesc(): void {
  this.technicienService.getByTicketOpeningDateDesc(this.technician.id).subscribe(tickets => {
    this.tickets = tickets;
    let ticketId=this.cookieService.get('ticketID');
    
      
  

  });
}
Alltickets!:any[];
 getAllTicket(): void {
  this.technicienService.getTickets(this.technician.id).subscribe(tickets => {
    this.Alltickets = tickets;
    console.log(this.Alltickets)

  });
}
technician:any;
getTechnicianDetails(): void {
  this.technicienService.getEmailFromToken().subscribe(
    (response) => {
      this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
        this.technicienService.technicianLogedIn = technician;
       
      });
    });

}
nbrNewTicket: number = 0;
nbrIN_PROGRESSTicket: number = 0;
nbrCLOSEDTicket: number = 0;
nbtRESOLVEDTicket:number=0;
getAllTicketByStatus(status: string): void {
    this.technicienService.getByStatus(status, this.technician.id).subscribe(tickets => {
      if (status === "NEW") {
        this.nbrNewTicket = tickets.length;
        console.log(this.nbrNewTicket )
      }
      else if (status === "IN_PROGRESS") {
        this.nbrIN_PROGRESSTicket = tickets.length;
        console.log(this.nbrIN_PROGRESSTicket )

      }
      else if(status==="RESOLVED"){
        this.nbtRESOLVEDTicket = tickets.length;
        console.log(this.nbtRESOLVEDTicket )

      }
      else if(status==="CLOSED"){
        this.nbrCLOSEDTicket = tickets.length;
        console.log(this.nbrCLOSEDTicket )

      }
    });
  
}
getAllTicketBycategory(): void {
  const colors = {
    INFRASTRUCTURE: '#7cb5ec', // Bleu clair
    SECURITY: '#90ed7d', // Vert clair
    ADMINISTRATION: '#f7a35c', // Orange clair
    DEVELOPMENT: '#8085e9', // Violet clair
  };
  this.technicienService.getByCategory("INFRASTRUCTURE", this.technician.id).subscribe(ticketsINFRASTRUCTURE => {
    this.technicienService.getByCategory("SECURITY", this.technician.id).subscribe(ticketsSECURITY => {
      this.technicienService.getByCategory("ADMINISTRATION", this.technician.id).subscribe(ticketsADMINISTRATION => {
        this.technicienService.getByCategory("DEVELOPMENT", this.technician.id).subscribe(ticketsDEVELOPMENT => {

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
getAllTicketByPriority(): void {
    
  this.technicienService.getByPiority("LOW", this.technician.id).subscribe(ticketsLOW => {
    this.technicienService.getByPiority("MEDIUM", this.technician.id).subscribe(ticketsMEDIUM => {
      this.technicienService.getByPiority("HIGH", this.technician.id).subscribe(ticketsHIGH => {
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
sortByOpeningDate: string = 'OpeningDateAsc'; // Pour stocker le type de tri

loadContracts(): void {

  if (this.sortByOpeningDate === 'OpeningDateAsc') {
    this.technicienService.getByTicketOpeningDateAsc(this.technician.id).subscribe(tickets => {
      this.tickets = tickets;
    });
  } else if (this.sortByOpeningDate === 'OpeningDateDesc') {
    this.technicienService.getByTicketOpeningDateDesc(this.technician.id).subscribe(tickets => {
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
