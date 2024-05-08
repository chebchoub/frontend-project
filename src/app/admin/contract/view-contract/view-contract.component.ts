import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.css']
})
export class ViewContractComponent implements OnInit{
  contractId!: string;
  startDate!: string;
  endDate!: string;
  updateDate!:string;
  ngOnInit(): void {
    this.contractId = this.contractService.selectedContractId;
    this.getContractDetails()
  }
  constructor(private route: ActivatedRoute, private router: Router,private contractService:ServiceContratService) 
  {
  }
  contract:any;

  getContractDetails(): void {
    this.contractService.getContractById(this.contractId).subscribe(contract => {
       this.startDate = this.formatDate(contract.startDate); // Formattez la date si nécessaire
      this.endDate = this.formatDate(contract.endDate); // Formattez la date si nécessaire
      this.updateDate=this.formatDate(contract.updateDate);
      this.contract=contract;
      console.log(this.contract);

    });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  closeModal() {
    this.contractService.closeModal();
  }
}
