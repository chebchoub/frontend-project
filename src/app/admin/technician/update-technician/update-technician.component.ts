import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContratService } from '../../services/service-contrat.service';
import { ServiceClientsService } from '../../services/service-clients.service';
import { ServiceTechnicianService } from '../../services/service-technician.service';
import { FormGroup } from '@angular/forms';
import { Technician } from '../../dto/technicien';
@Component({
  selector: 'app-update-technician',
  templateUrl: './update-technician.component.html',
  styleUrls: ['./update-technician.component.css']
})
export class UpdateTechnicianComponent implements OnInit{
  constructor(private route: ActivatedRoute, private router: Router, public technicianService: ServiceTechnicianService,public contractService: ServiceContratService) { }
  technicienId:string="";
 technicienForm: FormGroup | any;

  ngOnInit(): void {
    this.technicienId = this.technicianService.selectedTechniciaId;
//    this.initForm();
    this.getTechnicianDetails();
  }
  technicien:Technician={
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    poste: '',
    profilePhoto: '',
    startDateWork: new Date,
    ticketResolvedRating: 0,
    ticketWaitingList: undefined
  }
  getTechnicianDetails(): void {
    this.technicianService.getTechnicianById(this.technicianService.selectedTechniciaId).subscribe(techicien => {
      this.technicien=techicien;
      console.log(this.technicien)

    }, error => {
      console.error('Error deleting techicien:', error);
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
