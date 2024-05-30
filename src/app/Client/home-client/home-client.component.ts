import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientServiceService } from '../service/client-service.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { ServiceUserNotifService } from '../../notification/services/service-user-notif.service';
import { Subscription, interval, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-client',
  templateUrl: './home-client.component.html',
  styleUrls: ['./home-client.component.css']
})
export class HomeClientComponent implements OnInit, OnDestroy {
  client: any;
  isNotificationOpen: boolean = false;
  hasNewNotification: boolean = false;  // New flag to track new notifications
  notifs!: any[];
  private refreshInterval!: Subscription;
  private size = 10;

  constructor(
    private datePipe: DatePipe,
    public serviceClient: ClientServiceService,
    public userService: UserServiceService,
    public notificationService: ServiceUserNotifService
  ) { }

  ngOnInit(): void {
    this.getClientDetails();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  getClientDetails(): void {
    this.serviceClient.getEmailFromToken().subscribe(
      (response) => {
        this.serviceClient.getClientByEmail(response).subscribe(client => {
          this.client = client;
          this.serviceClient.clientLogedIn = client;
          this.notificationService.idUserLogin = client.id;
          this.setupAutoRefresh(client.id);
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

  isContractEndDatePastOrToday(endDate: string): boolean {
    const today = new Date();
    const formattedEndDate = new Date(this.datePipe.transform(endDate, 'yyyy-MM-dd') || '');
    return formattedEndDate <= today;
  }

  navigation(index: number) {
    if (index === 1) {
      this.serviceClient.getPageName = "Dashboard";
    } else if (index === 2) {
      this.serviceClient.getPageName = "Tickets";
    } else if (index === 3) {
      this.serviceClient.getPageName = "Profile";
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
    }, 1000);
  }
}
