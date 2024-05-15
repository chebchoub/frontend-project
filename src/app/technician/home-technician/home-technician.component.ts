import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceUserNotifService } from '../../notification/services/service-user-notif.service';
import { Subscription, interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-home-technician',
  templateUrl: './home-technician.component.html',
  styleUrl: './home-technician.component.css'
})
export class HomeTechnicianComponent implements OnInit,OnDestroy {
  constructor(public technicienService:ServiceTechnicianService,public userService:UserServiceService,public notificationService: ServiceUserNotifService)
  {

  }
  ngOnInit(): void {
    this.getTechnicianDetails()
  }
  technician:any;
  private notificationSubscription!: Subscription;
  isNotificationOpen: boolean = false;
  notifs!:any[];
  openPopUp: string = "";

  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technician=technician;
          this.technicienService.technicianLogedIn=technician;
          this.technicienService.updateTechnicianRating(technician.id).subscribe(
            (response: any) => {
              console.log(response)      
        });
          this.notificationService.idUserLogin = technician.id;

                this.getFalseNotificationsForAdmin(technician.id);

                this.notificationSubscription = interval(100).pipe(
                  switchMap(() => this.notificationService.getFalseNotificationsForUser(technician.id))
                ).subscribe(notif => {
                  this.notifs = notif;
                  if (this.notifs.length > 0) {
                    this.isNotificationOpen = true;
                  }
                });
        
         });
      });
  }
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
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

