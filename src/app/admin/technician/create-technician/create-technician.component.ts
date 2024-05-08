import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Technician } from '../../dto/technicien';
@Component({
  selector: 'app-create-technician',
  templateUrl: './create-technician.component.html',
  styleUrls: ['./create-technician.component.css']
})
export class CreateTechnicianComponent  implements OnInit
{
    constructor(private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService,public contractService: ServiceContratService) { }
    technicienId:string="";
   technicienForm: FormGroup | any;
  
    ngOnInit(): void {
      this.technicienForm = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
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
      this.technicianService.closeModal();
    }
  }
