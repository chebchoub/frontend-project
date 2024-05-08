import { Component, OnInit } from '@angular/core';
import { ClientServiceService } from '../service/client-service.service';
import { UserServiceService } from '../../auth/services/user-service.service';

@Component({
  selector: 'app-home-client',
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit{
  constructor( public serviceClient: ClientServiceService,public userService:UserServiceService)
  
  {
    
  }
  ngOnInit(): void {
    this.getClientDetails()
  }
  client:any;
  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.client=client;
          this.serviceClient.clientLogedIn=client;
         });
      });
   
  }
  navigation(index: number) {
    if (index === 1) {
      this.serviceClient.getPageName = "Dashboard";
    } else if (index === 2) {
      this.serviceClient.getPageName = "Tickets";

    } else if (index === 3) {
      this.serviceClient.getPageName = "Profile";

    } else if (index === 4) {
    } else {
    }
  }
  logout()
  {
    this.userService.logout();
  }
  openPopUp: string = "";
  modalNotificaiton() {
    this.serviceClient.toggleModal();
  }
  closeModal() {
    this.serviceClient.closeModal();
  }
}
