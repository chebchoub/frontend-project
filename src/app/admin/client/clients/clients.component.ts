import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { FormGroup } from '@angular/forms';
import { ServiceClientsService } from '../../services/service-clients.service';
import { EmailServiceService } from '../../services/email-service.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  searchText='';
  ngOnInit(): void {
    this.getAllClients();
    setTimeout(() => {
      this.contractService.getPageName = 'CLIENTS';
    });  }
  constructor(private datePipe: DatePipe,public emailService:EmailServiceService,private router: Router, public clientService: ServiceClientsService,private contractService:ServiceContratService) { }
  clients!: any[];
  getAllClients(): void {
    this.clientService.getAllClients().subscribe(clients => {

      this.clients = clients;
      
     console.log(this.clients)
    });
  }
  deleteClient(clientId: any) {
   
  }
  confirmDelete(): void {
    this.clientService.deleteClient(this.clientService.selectedClientId).subscribe(() => {
      console.log('Contract deleted successfully.');
      this.getAllClients();
      location.reload();
    }, error => {
      console.error('Error deleting contract:', error);
    });

  }
  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
  }

  cancelDelete(): void {
    this.clientService.selectedClientId= "";
    this.closeModal()
  }
   
  contractType: any;
  currentPage: number = 0;
  pageSize: number = 3; // Nombre de contrats par page
  calculateRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.clients.length);
    return { start, end };
  }
  getTotalPages(): number {
    return Math.ceil(this.clients.length / this.pageSize);
  }
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.clients.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }  
  listPREMIUM: boolean = false;
  getAllContractsByContractType(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const contractType = target.value;
    if (contractType === "ALL") {
      this.getAllClients(); // Méthode pour récupérer tous les contrats
      this.listPREMIUM = false;

    } else {
      if (contractType === "PREMIUM") {
        this.listPREMIUM = true;
      }
      if (contractType === "STANDARD") {
        this.listPREMIUM = false;
      }
      this.clientService.getContractByContractType(contractType).subscribe(clients => {
        this.clients = clients;
       
      });
    }
  }
  getAllContractsByContractPermiumType(premiumType: string) {
    this.clientService.getContractByPremiumType(premiumType).subscribe(clients => {
      this.clients = clients;
     
    });
  }
  sortByTicketAvailabel: string = 'TicketsAsc'; // Pour stocker le type de tri

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
  openPopUp: string = "";

  toggleModalview(destination: string, idContract: string) {
    this.openPopUp = destination;
    this.clientService.selectedClientId = idContract;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    // Afficher le popup
    this.clientService.toggleModal();
  }
  closeModal() {
    this.clientService.closeModal();
    this.getAllClients()
  }
  toggleModalDelete(destination: string, idContract: string) {
    this.openPopUp = destination;
    this.clientService.selectedClientId = idContract;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    // Afficher le popup
    this.clientService.toggleModal();
  }
  
  toggleModalSendEmail(destination: string,client:any) {
    this.openPopUp = destination;
    this.emailService.client=client;
    this.emailService.toggleModal();
  }
  
}
