import { Component, OnInit } from '@angular/core';
import { ManagerServiceService } from '../../../services/manager-service.service';
import { EmailServiceService } from '../../../services/email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceTechnicianService } from '../../../services/service-technician.service';
import { ServiceContratService } from '../../../services/service-contrat.service';

@Component({
  selector: 'app-manager-archived',
  templateUrl: './manager-archived.component.html',
  styleUrl: './manager-archived.component.css'
})
export class ManagerArchivedComponent implements OnInit{
  constructor(public  serviceManager:ManagerServiceService, public emailService: EmailServiceService, private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService, public contractService: ServiceContratService) { }

  ngOnInit(): void {
    this.getAllManager();
    setTimeout(() => {
      this.contractService.getPageName = ' Archived Managers';
    });
  }
  searchText :string= '';

  managers: any[] = [];
  listeVide: boolean = false;
  getAllManager(): void {
    this.serviceManager.ArchivedManager().subscribe(managers => {
      this.managers = managers;
      console.log(this.managers)


      if (this.managers.length == 0) {
        this.listeVide = true; // Correction de l'opérateur d'affectation
      }
    });
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

  confirmDelete(): void {
    this.serviceManager.unarchiveManager(this.serviceManager.selectedMangerEmail).subscribe(() => {
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
  openPopUp:string="";

  toggleModalunarchiveManager(destination: string, manageremail: string) {
    this.openPopUp = destination;
    this.serviceManager.selectedMangerEmail = manageremail;
    this.serviceManager.toggleModal();
  }
  closeModal() {
    this.serviceManager.closeModal();
  }
  
 
}
