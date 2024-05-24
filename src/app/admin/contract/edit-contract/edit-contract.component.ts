import { Component, OnInit } from '@angular/core';
import { ContractRequestPremium, ContractRequestStandart } from '../../dto/contract';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceContratService } from '../../services/service-contrat.service';
import { Location } from '@angular/common';
import { ServiceClientsService } from '../../services/service-clients.service';

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.css']
})
export class EditContractComponent implements OnInit {

  constructor(private clientService: ServiceClientsService, private location: Location, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public contractService: ServiceContratService) { }

  contractForm: FormGroup | any;
  contractId!: string;
  clietnId!: string;

  ngOnInit(): void {
    this.contractId = this.contractService.selectedContractId;
    this.clietnId = this.clientService.selectedClientId;
    this.initForm();
    this.getContractDetails();
    this.contractForm = this.formBuilder.group({
      entreprise: ['', Validators.required],
      startDate: new FormControl('', Validators.required),
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      premiumType: ['', Validators.required], // Assurez-vous que 'premiumType' est défini ici
      maintenance: ['', [Validators.required, Validators.min(0)]],
      contractType: ['STANDARD'] // Initialisez le contrôle contractType avec une valeur par défaut
      // Autres champs et validations
    }, { validators: [this.validateDates, this.validateStartDateBeforeEndDate] });
  }
  contractType: string = 'STANDARD'; // Valeur par défaut
  onContractTypeChange(type: string) {
    this.contractForm.contractType = type;
    this.contractType = this.contractForm.contractType;
  }
  validateDates(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate');
    const today = new Date();

    if (startDate?.value && new Date(startDate.value) < today) {
      startDate?.setErrors({ invalidStartDate: true });
    } else {
      startDate?.setErrors(null);
    }
  }
  validateStartDateBeforeEndDate(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate');
    const endDate = formGroup.get('endDate');

    if (startDate && endDate && startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      const threeMonthsLater = new Date(start.setMonth(start.getMonth() + 3));

      if (end <= start || end < threeMonthsLater) {
        endDate.setErrors({ invalidEndDate: true });
      } else {
        endDate.setErrors(null);
      }
    }
  }
  
  initForm(): void {
    this.contractForm = this.formBuilder.group({
      entreprise: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      // Ajoutez d'autres champs ici selon vos besoins
    });
  }


  getContractDetails(): void {

    this.contractService.getContractById(this.contractId).subscribe(contract => {
      const startDate = this.formatDate(contract.startDate); // Formattez la date si nécessaire
      const endDate = this.formatDate(contract.endDate); // Formattez la date si nécessaire
      this.contractForm?.patchValue({
        entreprise: contract.entreprise,
        startDate: startDate,
        endDate: endDate,
        contractType: contract.contractType,
        premiumType: contract.premiumType,
        maintenance: contract.maintenance,
        description: contract.description,
        // Patchez d'autres champs ici selon vos besoins
      });
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  ticketAvailable:number=0;
  submitForm(): void {

    const updatedContract = this.contractForm.value;
    if (this.contractForm.controls.contractType.value === "STANDARD") {
      this.ticketAvailable=0
    }
    else if (this.contractForm.controls.contractType.value === "PREMIUM") {
      if(this.contractForm.controls.premiumType.value === "SILVER"){
        this.ticketAvailable=5}
        else if(this.contractForm.controls.premiumType.value === "GOLD"){
          this.ticketAvailable=10
         
        
      }
    }
    this.contractService.editContract(updatedContract, this.contractId).subscribe(() => {
      console.log('Contract updated successfully.');
      this.clientService.updateClientTicketsAvailable(this.clietnId,this.ticketAvailable)
        .subscribe(() => {
          console.log('Mise à jour réussie.');
          location.reload();
        }, (error) => {
          console.error('Erreur lors de la mise à jour :', error);
        });
      this.closeModal();
      this.getAllContracts()
      // Mettre à jour la liste des contrats après la modification réussie

    }, error => {
      console.error('Error updating contract:', error);
      // Gérer les erreurs de mise à jour du contrat ici
    });

  }

  
  getAllContracts(): void {
    this.contractService.getAllContracts().subscribe(contracts => {
      
     
    });
  }
  validateStandardContract(): boolean {
    return (
      this.contractForm.controls.entreprise.valid &&
      this.contractForm.controls.startDate.valid &&
      this.contractForm.controls.endDate.valid &&
      this.contractForm.controls.description.valid
    );
  }
  validatePremiumContract(): boolean {
    return (
      this.contractForm.controls.entreprise.valid &&
      this.contractForm.controls.startDate.valid &&
      this.contractForm.controls.endDate.valid &&
      this.contractForm.controls.description.valid &&
      this.contractForm.controls.maintenance.valid &&
      this.contractForm.controls.premiumType.valid 

    );
  }

  openPopUp: string = "";
  contractRequest!: ContractRequestStandart;
  toggleModalCreate(destination: string) {
    if (this.validateStandardContract()||this.validatePremiumContract())
    {
        this.openPopUp = destination;
        this.contractService.toggleModalConfirmer();
    }else {
      this.contractForm.markAllAsTouched();
    }
  
}

  closeModal() {
    this.contractService.closeModal();

  }
  closeModalConfimer() {
    this.contractService.closeModalConfimer();
  }

}