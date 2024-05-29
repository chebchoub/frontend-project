import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceTechnicianService } from '../service/service-technician.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceUserNotifService } from '../../notification/services/service-user-notif.service';
import { Subscription, interval, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home-technician',
  templateUrl: './home-technician.component.html',
  styleUrls: ['./home-technician.component.css']
})
export class HomeTechnicianComponent implements OnInit, OnDestroy {
  technician: any;
  private notificationSubscription!: Subscription;
  isNotificationOpen: boolean = false;
  hasNewNotification: boolean = false;  // New flag to track new notifications
  notifs!: any[];
  openPopUp: string = "";
  private refreshInterval!: Subscription;
  private page = 0;
  private size = 10;

  constructor(
    private cookieService:CookieService,
    public technicienService: ServiceTechnicianService,
    public userService: UserServiceService,
    public notificationService: ServiceUserNotifService
  ) { }

  ngOnInit(): void {
    this.cookieService.set('ticketID', '', 7, '/', '', true, 'Lax');

    this.getTechnicianDetails();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  getTechnicianDetails(): void {
    this.technicienService.getEmailFromToken().subscribe(
      (response) => {
        this.technicienService.getTechnicianByEmail(response).subscribe(technician => {
          this.technician = technician;
          this.technicienService.technicianLogedIn = technician;
          this.technicienService.updateTechnicianRating(technician.id).subscribe(
            (response: any) => {
              console.log(response);
            }
          );
          this.notificationService.idUserLogin = technician.id;
          this.setupAutoRefresh(technician.id);
        });
      });
  }

  
  setupAutoRefresh(id: string): void {
    this.refreshInterval = interval(100).pipe(
      switchMap(() => this.notificationService.getAllNotificationsForUser(id, 0, this.size))
    ).subscribe(response => {
      if (response && response.content) {
        this.notifs = response.content;
        this.hasNewNotification = this.notifs.some(notif => !notif.readStatus);
      }
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
      // Handle other navigation
    }
  }

  logout() {
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
        this.hasNewNotification = false;
      }
    );
  }

  toggleModalNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.hasNewNotification = false;  // Reset the flag when the modal is opened
    this.notificationService.toggleModal();

    setTimeout(() => {
      this.markNotificationsAsRead();
    }, 10000);
  }
}
