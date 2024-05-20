import { Component, OnInit } from '@angular/core';
import { EmailServiceService } from '../../../services/email-service.service';
import { ServiceClientsService } from '../../../services/service-clients.service';
import { Router } from '@angular/router';
import { ServiceContratService } from '../../../services/service-contrat.service';

@Component({
  selector: 'app-clients-archived',
  templateUrl: './clients-archived.component.html',
  styleUrl: './clients-archived.component.css'
})
export class ClientsArchivedComponent implements OnInit {
  searchText='';
  ngOnInit(): void {
    this.getAllClients();
    setTimeout(() => {
      this.contractService.getPageName = 'archived CLIENTS';
    });  }
  constructor(public emailService:EmailServiceService,private router: Router, public clientService: ServiceClientsService,private contractService:ServiceContratService) { }
  clients!: any[];
  getAllClients(): void {
    this.clientService.getAllClientsArchive().subscribe(clients => {

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
      this.closeModal()
    }, error => {
      console.error('Error deleting contract:', error);
    });

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
      this.clientService.getContractByContractTypeClientArchived(contractType).subscribe(clients => {
        this.clients = clients;
       
      });
    }
  }
  getAllContractsByContractPermiumType(premiumType: string) {
    this.clientService.getContractByPremiumTypeClientArchived(premiumType).subscribe(clients => {
      this.clients = clients;
     
    });
  }
  sortByTicketAvailabel: string = 'TicketsAsc'; // Pour stocker le type de tri

  loadContracts(): void {

    if (this.sortByTicketAvailabel === 'TicketsAsc') {
      this.clientService.getByTicketsAvailableAscClientArchived().subscribe(clients => {
        this.clients = clients;
      });
    } else if (this.sortByTicketAvailabel === 'TicketsDesc') {
      this.clientService.getByTicketsAvailableDescClientArchived().subscribe(clients => {
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
    this.router.navigate(['/homeAdmin/clients']);
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
