import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { EmailServiceService } from '../../services/email-service.service';

@Component({
  selector: 'app-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.css']
})
export class TechniciansComponent implements OnInit {
  technician: any;
  constructor(public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }
  ngOnInit(): void {
    this.getAllTechnician();
    setTimeout(() => {
      this.contractService.getPageName = 'TECHNICIANS';
    });
  }
  searchText: string = '';

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
  pageSize: number = 7; // Nombre de contrats par page

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
  confirmDelete(): void {
    this.technicianService.deleteTechnician(this.technicianService.selectedTechniciaId).subscribe(() => {
      console.log('Technicien deleted successfully.');
      this.getAllTechnician();
      this.closeModal()
      this.router.navigate(['./homeAdmin/technicians',]);

    }, error => {
      console.error('Error deleting techicien:', error);
    });
  }
  cancelDelete(): void {
    this.contractService.selectedContractId = "";
    this.closeModal()
  }
  technicianSelectedId: string = "";

  sortByTicketWaitingList: string = 'TicketWaitingListAsc'; // Pour stocker le type de tri
  sortByRating: string = 'RatingAsc'; // Pour stocker le type de tri

  loadTechniciensortByrating(): void {
    if (this.sortByRating === 'RatingAsc') {
      this.technicianService.getByRatingAsc().subscribe(technicians => {
        this.technicians = technicians;
      });
    } else if (this.sortByRating === 'RatingDesc') {
      this.technicianService.getByRatingDesc().subscribe(technicians => {
        this.technicians = technicians;
      });
    }
    
  }
  loadTechniciensortByTicketWaitingList(): void {
    if (this.sortByTicketWaitingList === 'TicketWaitingListAsc') {
      this.technicianService.getByTicketWaitingListAsc().subscribe(technicians => {
        this.technicians = technicians;
      });
    } else if (this.sortByTicketWaitingList === 'TicketWaitingListDesc') {
      this.technicianService.getByTicketWaitingListDesc().subscribe(technicians => {
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
    this.loadTechniciensortByTicketWaitingList();
  }
  sortByrating(): void {
    if (this.sortByRating === 'RatingAsc') {
      this.sortByRating = 'RatingDesc';
    } else {
      this.sortByRating = 'RatingAsc';
    }
    this.loadTechniciensortByrating();
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
  openPopUp: string = "";
  toggleModalDelete(destination: string, idTechnicien: string) {
    this.openPopUp = destination;
    this.technicianService.selectedTechniciaId = idTechnicien;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    // Afficher le popup
    this.technicianService.toggleModal();
  }
  closeModal() {
    this.technicianService.closeModal();
  }
  toggleModalEdit(destination: string, idTechnicien: string) {
    this.openPopUp = destination;
    this.technicianService.selectedTechniciaId = idTechnicien;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    this.router.navigate(['homeAdmin/editTechnicians']);
    // Afficher le popup
    this.technicianService.toggleModal();
  }
  toggleModalCreate(destination: string) {
    this.openPopUp = destination;

    this.technicianService.toggleModal();

  }
  toggleModalview(destination: string, idTechnicien: string) {
    this.openPopUp = destination;
    this.technicianService.selectedTechniciaId = idTechnicien;

    this.technicianService.toggleModal();
  }
  toggleModalSendEmail(destination: string, techicien: any, titreTicket: string, dateouverture: string) {
    this.openPopUp = destination;
    this.emailService.technicien = techicien;
    this.emailService.titreTicket = titreTicket;
    this.emailService.dateouverture = dateouverture;

    this.emailService.toggleModal();
  }
  toggleModalSendEmailCreate(destination: string) {
    this.openPopUp = destination;

    this.technicianService.toggleModal();
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
