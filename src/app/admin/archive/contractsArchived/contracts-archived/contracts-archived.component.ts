import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../../services/service-contrat.service';
import { ServiceClientsService } from '../../../services/service-clients.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contracts-archived',
  templateUrl: './contracts-archived.component.html',
  styleUrl: './contracts-archived.component.css'
})
export class ContractsArchivedComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, public contractService: ServiceContratService, private clientService: ServiceClientsService) { }
  ngOnInit(): void {

    this.getAllContracts()
    setTimeout(() => {
      this.contractService.getPageName = 'Archived CONTRACTS';
    });
  }
  searchText='';
  contractType: any;
  currentPage: number = 0;
  pageSize: number = 7; // Nombre de contrats par page

  calculateRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.contracts.length);
    return { start, end };
  }
  getTotalPages(): number {
    return Math.ceil(this.contracts.length / this.pageSize);
  }
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.contracts.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  contractTypeForm: FormGroup | any;


  contracts: any[] = [];
  listeVide: boolean = false;
  getAllContracts(): void {
    this.contractService.getAllContractsArchived().subscribe(contracts => {
      this.contracts = contracts;

      if (this.contracts.length == 0) {
        this.listeVide == true;
      }
    });
  }


  listPREMIUM: boolean = false;
  getAllContractsByContractType(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversion de type explicite
    const contractType = target.value;
    if (contractType === "ALL") {
      this.getAllContracts(); // Méthode pour récupérer tous les contrats
      this.listPREMIUM = false;

    } else {
      if (contractType === "PREMIUM") {
        this.listPREMIUM = true;
      }
      if (contractType === "STANDARD") {
        this.listPREMIUM = false;
      }
      this.contractService.getContractByContractTypeArchived(contractType).subscribe(contracts => {
        this.contracts = contracts;
        console.log(this.contracts);
        if (this.contracts.length == 0) {
          this.listeVide == true;
        }
      });
    }
  }

  getAllContractsByContractPermiumType(premiumType: string) {
    this.contractService.getContractByPremiumTypeArchived(premiumType).subscribe(contracts => {
      this.contracts = contracts;
      console.log(this.contracts);
      if (this.contracts.length == 0) {
        this.listeVide == true;
      }
    });
  }
  sortByDate: string = 'EndDateAsc'; // Pour stocker le type de tri
  sortByTicket: string = 'TicketsAsc'; // Pour stocker le type de tri
  loadContracts(): void {
    if (this.sortByDate === 'EndDateAsc') {
      this.contractService.getByEndDateAscArchived().subscribe(contracts => {
        this.contracts = contracts;
      });
    } else if (this.sortByDate === 'EndDateDesc') {
      this.contractService.getByEndDateDescArchived().subscribe(contracts => {
        this.contracts = contracts;
      });
    }

    if (this.sortByTicket === 'TicketsAsc') {
      this.contractService.getByTicketsAscArchived().subscribe(contracts => {
        this.contracts = contracts;
      });
    } else if (this.sortByTicket === 'TicketsDesc') {
      this.contractService.getByTicketsDescArchived().subscribe(contracts => {
        this.contracts = contracts;
      });
    }
  }



  sortByEndDate(): void {
    if (this.sortByDate === 'EndDateAsc') {
      this.sortByDate = 'EndDateDesc';
    } else {
      this.sortByDate = 'EndDateAsc';
    }
    this.loadContracts();
  }

  sortByTickets(): void {
    if (this.sortByTicket === 'TicketsAsc') {
      this.sortByTicket = 'TicketsDesc';
    } else {
      this.sortByTicket = 'TicketsAsc';
    }
    this.loadContracts();
  }

    openPopUp: string = "";
    toggleModalCreate(destination: string) {
      this.openPopUp = destination;
      this.router.navigate(['homeAdmin/createContract']);

      this.contractService.toggleModal();

    }
  toggleModalEdit(destination: string, idContract: string) {
    this.openPopUp = destination;
    this.contractService.selectedContractId = idContract;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    this.router.navigate(['homeAdmin/editContract']);
    // Afficher le popup
    this.contractService.toggleModal();
  } 
  toggleModalview(destination: string, idContract: string) {
    this.openPopUp = destination;
    this.contractService.selectedContractId = idContract;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    // Afficher le popup
    this.contractService.toggleModal();
  }
  toggleModalDelete(destination: string, idContract: string) {
    this.openPopUp = destination;
    this.contractService.selectedContractId = idContract;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    // Afficher le popup
    this.contractService.toggleModal();
  }




  closeModal() {
    this.contractService.closeModal();
  }


}
