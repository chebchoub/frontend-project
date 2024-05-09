import { Component, OnInit } from '@angular/core';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { UserServiceService } from '../../auth/services/user-service.service';

@Component({
  selector: 'app-home-technician',
  templateUrl: './home-technician.component.html',
  styleUrl: './home-technician.component.css'
})
export class HomeTechnicianComponent implements OnInit {
  constructor(public technicienService:ServiceTechnicianService,public userService:UserServiceService)
  {

  }
  ngOnInit(): void {
    this.getTechnicianDetails()
  }
  technician:any;
  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technician=technician;
          this.technicienService.technicianLogedIn=technician;
         });
      });
  }
  navigation(index: number) {
    if (index === 1) {
      this.technicienService.getPageName = "Dashboard";
    } else if (index === 2) {
      this.technicienService.getPageName = "Tickets";

    } else if (index === 3) {
      this.technicienService.getPageName = "Profile";

    } else if (index === 4) {
    } else {
    }
  }
  logout()
  {
    this.userService.logout();
  }
}
