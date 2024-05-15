import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientServiceService } from '../service/client-service.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { UserNotificationComponent } from '../../notification/user-notification/user-notification.component';
import { ServiceUserNotifService } from '../../notification/services/service-user-notif.service';
import { Subscription, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-home-client',
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit,OnDestroy{
  constructor( public serviceClient: ClientServiceService,public userService:UserServiceService   , public notificationService: ServiceUserNotifService,
  )
  
  {
    
  }
  ngOnInit(): void {
    this.getClientDetails()
  }
  private notificationSubscription!: Subscription;

  client:any;
  isNotificationOpen: boolean = false;
  notifs!:any[];
  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.client=client;
          this.serviceClient.clientLogedIn=client;

          this.notificationService.idUserLogin = client.id;

                this.getFalseNotificationsForAdmin(client.id);

                this.notificationSubscription = interval(100).pipe(
                  switchMap(() => this.notificationService.getFalseNotificationsForUser(client.id))
                ).subscribe(notif => {
                  this.notifs = notif;
                  if (this.notifs.length > 0) {
                    this.isNotificationOpen = true;
                  }
                });
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
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }


  getFalseNotificationsForAdmin(id: string): void {
    this.notificationService.getFalseNotificationsForUser(id).subscribe(notif => {
      this.notifs = notif;
      
    });
  }

  markNotificationsAsRead(): void {
    this.notificationService.markNotificationsAsRead(this.notifs).subscribe(
      (response) => {
        console.log('Notifications marked as read:', response);
      }
    );

  }


  toggleModalNotification() {
    this.notificationService.toggleModal();
    this.isNotificationOpen = false;

    setTimeout(() => {
      this.markNotificationsAsRead()
    }, 7000);
  }
}
