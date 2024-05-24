import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailServiceService } from '../../services/email-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  clientId!: string;
  client: any;
  contracts!: any[];
  currentPage: number = 0;
  pageSize: number = 6;
  ticketsAvailableForm: FormGroup | any;
  ngOnInit(): void {
    this.clientId = this.clientService.selectedClientId;
    this.getClientDetails();
    this.getClientContracts();
    this.ticketsAvailableForm = this.formBuilder.group({
      ticketsAvailable: ['', [Validators.required, Validators.min(0)]],
    }
    )
  }
  constructor(private datePipe: DatePipe,public emailService:EmailServiceService,private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public clientService: ServiceClientsService, public contractService: ServiceContratService) {
  }
  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
  }
  companyLogoURL: string = '';

  getClientDetails() {
    this.clientService.getClientDetailsById(this.clientId).subscribe(client => {
      this.client = client;
      this.companyLogoURL = this.client?.companyLogo || '';

      this.ticketsAvailableForm?.patchValue({

        ticketsAvailable: client.ticketsAvailable
        // Patchez d'autres champs ici selon vos besoins
      });
    }

    )
  }
  getClientContracts() {
    this.clientService.getClientContracts(this.clientId).subscribe(contracts => {
      this.contracts = contracts;
    }
    )
  }


  sendEmail(email: string): void {
    const subject = 'Sujet de l\'e-mail'; // Sujet de l'e-mail

    // Créez l'URL mailto avec l'adresse e-mail du destinataire et le sujet du message
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    // Ouvrez l'URL mailto dans une nouvelle fenêtre
    window.open(mailtoUrl, '_blank');
  }
  closeModal() {
    this.clientService.closeModal();
  }
  // Dans votre composant TypeScript
  incrementTickets() {
    const ticketsAvailableControl = this.ticketsAvailableForm.get('ticketsAvailable');
    if (ticketsAvailableControl) {
      let currentValue = ticketsAvailableControl.value || 0;
      currentValue++;
      ticketsAvailableControl.setValue(currentValue);
    }
  }

  decrementTickets() {
    const ticketsAvailableControl = this.ticketsAvailableForm.get('ticketsAvailable');
    if (ticketsAvailableControl) {
      let currentValue = ticketsAvailableControl.value || 0;
      if (currentValue > 0) {
        currentValue--;
        ticketsAvailableControl.setValue(currentValue);
      }
    }
  }
  ticketsAvailable: number = 0;
  addTicketsToClient(clientId: string) {
    const ticketsAvailable = this.ticketsAvailableForm.get('ticketsAvailable').value;

    this.clientService.updateClientTicketsAvailable(clientId, ticketsAvailable)
      .subscribe(() => {
        console.log('Mise à jour réussie.');
        location.reload();
      }, (error) => {
        console.error('Erreur lors de la mise à jour :', error);
      });
  }
  openPopUp: string = "";
  toggleModalCreate(destination: string) {

    this.openPopUp = destination;
    this.clientService.toggleModalConfirmer();


  }
  closeModalConfimer() {
    this.clientService.closeModalConfimer();
  } 
  toggleModalEdit(destination: string, idContract: string,idclient:string) {
    this.openPopUp = destination;
    this.contractService.selectedContractId = idContract;
    this.clientService.selectedClientId=idclient;
    // Naviguer vers la nouvelle URL avec l'ID du contrat
    this.router.navigate(['homeAdmin/client']);
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
  openPopUptoggleModalAddcontract:string="";
  toggleModalAddcontract(destination: string) {
    this.openPopUptoggleModalAddcontract = destination;
    this.clientService.selectedClientId=this.client.id;
    this.clientService.toggleModalAddConttract();
  }

  toggleModalSendEmail(destination: string,client:any) {
    this.openPopUp = destination;
    this.emailService.client=client;
    this.emailService.toggleModal();
  }
  confirmDelete(): void {
    this.contractService.deleteContract(this.contractService.selectedContractId).subscribe(() => {
      console.log('Contract deleted successfully.');
      this.getClientContracts();
      this.closeModal()
      this.router.navigate(['./homeAdmin/contracts',]);

    }, error => {
      console.error('Error deleting contract:', error);
    });

  }
  cancelDelete(): void {
    this.contractService.selectedContractId = "";
    this.closeModal()
  }





}