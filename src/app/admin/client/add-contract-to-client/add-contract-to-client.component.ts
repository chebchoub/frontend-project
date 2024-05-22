import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contract-to-client',
  templateUrl: './add-contract-to-client.component.html',
  styleUrl: './add-contract-to-client.component.css'
})
export class AddContractToClientComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, public contractService: ServiceContratService, public clientService: ServiceClientsService) { }
  errorMessage:string="";
  form: FormGroup | any;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      contractSerialNumber: ['', [Validators.required, Validators.pattern(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/)]]

    });
  }

  submitForm(): void {
    this.clientService.addContractToClient(this.clientService.selectedClientId, this.form.controls.contractSerialNumber.value).subscribe(() => {

     
    }, error => {
      if (error.status === 404) {
        this.errorMessage = 'Client not found.';
      } else if (error.status === 400) {
        this.errorMessage = 'Invalid contract serial number.';
      } else if (error.status === 409) {
        this.errorMessage = 'Contract already assigned to another client.';
      } else if (error.status === 403) {
        this.errorMessage = 'Contract is archived.';
      } else {
        this.errorMessage = 'Contract added successfully';
        setTimeout(() => {
          location.reload()
        }, 2000);
         
      }
      this.toggleModalAlert("alert")
      setTimeout(() => {
        this.closeModalAlert()
      }, 2000);
       });
  
}

  openPopUp: string = "";
    toggleModalCreate(destination: string) {
      this.openPopUp = destination;

      this.contractService.toggleModal();
     
    }

    closeModal() {
      this.clientService.closeModalAddConttract();
    }

    toggleModalAlert(destination: string) {
      this.openPopUp = destination;
      this.clientService.toggleModalConfirmer();

    }
    closeModalAlert() {
      this.clientService.closeModalConfimer();
    }
}
