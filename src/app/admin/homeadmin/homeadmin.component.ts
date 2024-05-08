import { Component } from '@angular/core';
import { ServiceContratService } from '../services/service-contrat.service';
import { UserServiceService } from '../../auth/services/user-service.service';

@Component({
  selector: 'app-homeadmin',
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent {
  navigationIndex: number = 0;
  constructor(public contractService: ServiceContratService,public userService:UserServiceService) { }

  navigation(index: number) {
    if (index === 1) {
      this.contractService.getPageName = "Dashboard";
    } else if (index === 2) {
      this.contractService.getPageName = 'Tickets';
    } else if (index === 3) {
      this.contractService.getPageName = 'CLIENTS';
    } else if (index === 4) {
      this.contractService.getPageName = 'CONTRACTS';
    } else {
      this.contractService.getPageName = 'TECHNICIENS';
    }
  }
  logoutAdmin()
  {
    this.userService.logout();
  }

}
