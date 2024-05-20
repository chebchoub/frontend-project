import { Component, OnInit } from '@angular/core';
import { EmailServiceService } from '../../services/email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ManagerServiceService } from '../../services/manager-service.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css'
})
export class ManagersComponent implements OnInit{
  constructor(public  serviceManager:ManagerServiceService, public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }

  ngOnInit(): void {
    this.getAllManager();
    setTimeout(() => {
      this.contractService.getPageName = 'Managers';
    });
  }
  searchText :string= '';

  managers: any[] = [];
  listeVide: boolean = false;
  getAllManager(): void {
    this.serviceManager.getAllManager().subscribe(managers => {
      this.managers = managers;
      console.log(this.managers)


      if (this.managers.length == 0) {
        this.listeVide = true; // Correction de l'opérateur d'affectation
      }
    });
  }
  confirmDelete(): void {
    this.serviceManager.deleteManager(this.serviceManager.selectedMangerEmail).subscribe(() => {
      console.log('manager deleted successfully.');
      this.getAllManager();
      this.closeModal()
      location.reload();

    }, error => {
      console.error('Error :', error);
    });
  }
  cancelDelete(): void {
    this.serviceManager.selectedMangerEmail = "";
    this.closeModal()
  }
  currentPage: number = 0;
  pageSize: number = 7; // Nombre de contrats par page

  calculateRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.managers.length);
    return { start, end };
  }
  getTotalPages(): number {
    return Math.ceil(this.managers.length / this.pageSize);
  }
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.managers.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  openPopUp:string="";
  toggleModalSendEmailCreate(destination: string) {
    this.openPopUp = destination;

    this.serviceManager.toggleModal();
  }
 
  toggleModalDelete(destination: string, managerid: string) {
    this.openPopUp = destination;
    this.serviceManager.selectedMangerEmail = managerid;
    this.serviceManager.toggleModal();
  }
  toggleModalSendEmail(destination: string, techicien: any, titreTicket: string, dateouverture: string) {
    this.openPopUp = destination;
    this.emailService.technicien = techicien;
    this.emailService.titreTicket = titreTicket;
    this.emailService.dateouverture = dateouverture;
    this.emailService.toggleModal();
  }
  closeModal() {
    this.serviceManager.closeModal();
  }
}
