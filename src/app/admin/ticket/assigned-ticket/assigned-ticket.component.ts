import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { EmailServiceService } from '../../services/email-service.service';
import { TicketServiceService } from '../../services/ticket-service.service';
@Component({
  selector: 'app-assigned-ticket',
  templateUrl: './assigned-ticket.component.html',
  styleUrls: ['./assigned-ticket.component.css']
})
export class AssignedTicketComponent implements OnInit {
  constructor(public ticketService:TicketServiceService,public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  ngOnInit(): void {
    this.getAllTechnician();
    setTimeout(() => {
      this.contractService.getPageName = 'TECHNICIENS';
    });
  }
  searchText = '';

  technicians: any[] = [];
  listeVide: boolean = false;
  getAllTechnician(): void {
    this.technicianService.getAllTechnician().subscribe(technicians => {
      this.technicians = technicians;
      console.log(this.technicians)


      if (this.technicians.length == 0) {
        this.listeVide = true; // Correction de l'opérateur d'affectation
      }
    });
  }
  currentPage: number = 0;
  pageSize: number = 4 // Nombre de contrats par page

  calculateRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.technicians.length);
    return { start, end };
  }
  getTotalPages(): number {
    return Math.ceil(this.technicians.length / this.pageSize);
  }
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.technicians.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  

  technicianSelectedId: string = "";

  sortByTicketWaitingList: string = 'TicketWaitingListAsc'; // Pour stocker le type de tri
  sortByRating: string = 'RatingAsc'; // Pour stocker le type de tri
  loadTechniciens(): void {
    if (this.sortByTicketWaitingList === 'TicketWaitingListAsc') {
      this.technicianService.getByTicketWaitingListAsc().subscribe(technicians => {
        this.technicians = technicians;
      });
    } else if (this.sortByTicketWaitingList === 'TicketWaitingListDesc') {
      this.technicianService.getByTicketWaitingListDesc().subscribe(technicians => {
        this.technicians = technicians;
      });
    }

    if (this.sortByRating === 'RatingAsc') {
      this.technicianService.getByStartDateWorkAsc().subscribe(technicians => {
        this.technicians = technicians;
      });
    } else if (this.sortByRating === 'RatingDesc') {
      this.technicianService.getByStartDateWorkDesc().subscribe(technicians => {
        this.technicians = technicians;
      });
    }
    if (this.startDateWork === 'startDateWorkAsc') {
      this.technicianService.getByStartDateWorkAsc().subscribe(technicians => {
        this.technicians = technicians;
      });
    } else if (this.startDateWork === 'TicketWaitingListAsc') {
      this.technicianService.getByStartDateWorkDesc().subscribe(technicians => {
        this.technicians = technicians;
      });
    }
  }



  sortByticketWaitingList(): void {
    if (this.sortByTicketWaitingList === 'TicketWaitingListAsc') {
      this.sortByTicketWaitingList = 'TicketWaitingListDesc';
    } else {
      this.sortByTicketWaitingList = 'TicketWaitingListAsc';
    }
    this.loadTechniciens();
  }
  sortByrating(): void {
    if (this.sortByRating === 'RatingAsc') {
      this.sortByRating = 'RatingDesc';
    } else {
      this.sortByRating = 'RatingAsc';
    }
    this.loadTechniciens();
  }
  getBySpeciality(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const poste = target.value;
    if (poste === "ALL") {
      this.getAllTechnician(); // Méthode pour récupérer tous les contrats

    } else {
      this.technicianService.getBySpeciality(poste).subscribe(technicians => {
        this.technicians = technicians;
        if (this.technicians.length == 0) {
          this.listeVide == true;
        }
      });
    }
  }
  loadTechniciens2(): void {
    
    if (this.startDateWork === 'startDateWorkAsc') {
      this.technicianService.getByStartDateWorkAsc().subscribe(technicians => {
        this.technicians = technicians;
      });
    } else if (this.startDateWork === 'startDateWorkDesc') {
      this.technicianService.getByStartDateWorkDesc().subscribe(technicians => {
        this.technicians = technicians;
      });
    }
  }
  startDateWork:string="startDateWorkAsc"
 sortByStartDateWork(): void {
    if (this.startDateWork === 'startDateWorkAsc') {
      this.startDateWork = 'startDateWorkDesc';
    } else {
      this.startDateWork = 'startDateWorkAsc';
    }
    this.loadTechniciens2();
  }
  technicien:any;
  getTechnicianDetails(id:string): void {
    this.technicianService.getTechnicianById(id).subscribe(techicien => {
      this.technicien=techicien;
    }, error => {
      console.error('Error', error);
    });

  }
  confirmAssign(): void {
    this.technicianService.addTicketToTechnicien(this.technicianService.selectedTicketId,this.technicianService.selectedTechniciaId).subscribe(() => {
      console.log('ticket Assigned successfully.');
      this.getAllTechnician();
      this.closeModal()
    }, error => {
      console.error('Error deleting techicien:', error);
    });
  }
  cancelAssign(): void {
    this.contractService.selectedContractId = "";
    this.ticketService.closeModalConfimer()
  }
  openPopUp: string = "";
  toggleModalAssigndConfirmer(destination: string, idTechnicien: string) {
    this.openPopUp = destination;
    this.technicianService.selectedTechniciaId = idTechnicien;
    this.getTechnicianDetails(idTechnicien)
    this.ticketService.toggleModalConfirmer();
  }
  closeModal() {
    this.ticketService.closeModal();
  }

  

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
