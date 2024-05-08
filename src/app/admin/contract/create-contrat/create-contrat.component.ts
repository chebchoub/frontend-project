import { Component, OnInit } from '@angular/core';
import { ContractRequestPremium, ContractRequestStandart } from '../../dto/contract';
import { ServiceContratService } from '../../services/service-contrat.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-contrat',
  templateUrl: './create-contrat.component.html',
  styleUrls: ['./create-contrat.component.css']
})
export class CreateContratComponent implements OnInit {
  contractForm: FormGroup | any;

  constructor(private formBuilder: FormBuilder, public contractService: ServiceContratService, private router: Router) { }

  ngOnInit(): void {
    this.contractForm = this.formBuilder.group({
      entreprise: ['', Validators.required],
      startDate: new FormControl('', Validators.required),
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      premiumType: ['', Validators.required], // Assurez-vous que 'premiumType' est défini ici
      maintenance: ['', Validators.required],
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
    // Supprimez cette ligne pour permettre à la date de début d'être antérieure à la date actuelle
    // const today = new Date();

    if (startDate?.value) {
        // Supprimez la vérification de la date actuelle
        // if (new Date(startDate.value) < today) {
        //     startDate?.setErrors({ invalidStartDate: true });
        // } else {
            startDate?.setErrors(null);
        // }
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
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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


  addContract(): void {
    if (this.contractForm.get('contractType')?.value === 'STANDARD') {
      const contractRequest: ContractRequestStandart = {
        entreprise: this.contractForm.value.entreprise,
        startDate: this.contractForm.value.startDate,
        endDate: this.contractForm.value.endDate,
        description: this.contractForm.value.description,
        contractType: this.contractForm.value.contractType,
        tickets: 0
      };
      this.contractService.createContractStandart(contractRequest).subscribe(() => {
        console.log("Standard contract created");
        this.contractForm.reset();
        this.closeModalConfimer();
        this.router.navigate(['./homeAdmin/contracts']);
        // Ajoutez ici le code pour la suite des actions si nécessaire
      }, error => {
        console.error('Error adding standard contract:', error);
      });
    }
    else{
      const contractRequest: ContractRequestPremium = {
        entreprise: this.contractForm.value.entreprise,
        startDate: this.contractForm.value.startDate,
        endDate: this.contractForm.value.endDate,
        maintenance: this.contractForm.value.maintenance,
        description: this.contractForm.value.description,
        premiumType: this.contractForm.value.premiumType,
        contractType: this.contractForm.value.contractType,
        tickets: 0
      };

      this.contractService.createContractPremium(contractRequest).subscribe(() => {
        console.log("Premium contract created");
        // Réinitialiser le formulaire après l'ajout du contrat
        this.contractForm.reset();
        this.closeModalConfimer();
        this.router.navigate(['./homeAdmin/contracts']);
      }, error => {
        console.error('Error adding premium contract:', error);
      });
    }

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
    this.router.navigate(['/homeAdmin/contracts']);

  }
  closeModalConfimer() {
    this.contractService.closeModalConfimer();
  }


}
