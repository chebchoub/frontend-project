import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServiceUserNotifService } from '../services/service-user-notif.service';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.css']
})
export class UserNotificationComponent implements OnInit, OnDestroy {
  notifs: any[] = [];
  notifsFlase: any[] = [];
  private subscription!: Subscription;
  private page = 0;
  private size = 10;
  private isLoading = false;
  public isLastPage = false;  // Make this public
  private refreshInterval!: Subscription;

  constructor(private notificationService: ServiceUserNotifService) { }

  ngOnInit(): void {
    console.log(this.notificationService.idUserLogin)
    this.loadNotifications();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  setupAutoRefresh(): void {
    this.refreshInterval = interval(100).pipe(  // Poll every 10 seconds
      switchMap(() => this.notificationService.getAllNotificationsForUser(this.notificationService.idUserLogin, 0, this.size))
    ).subscribe(response => {
      if (response && response.content) {
        this.notifs = response.content.map((notif: any) => ({ ...notif, isNew: !notif.readStatus }));
      }
    });
  }

  loadNotifications(refresh: boolean = false): void {
    if (this.isLoading || this.isLastPage) return;

    this.isLoading = true;
    this.notificationService.getAllNotificationsForUser(this.notificationService.idUserLogin, this.page, this.size)
      .subscribe(response => {
        if (response && response.content) {
          if (refresh) {
            this.notifs = response.content;
            this.page = 1;  // Reset page to 1 after refresh
          } else {
            this.notifs = [...this.notifs, ...response.content];
            this.page++;
          }
          this.isLastPage = response.last;
        } else {
          console.error('Expected a paginated response but got:', response);
        }
        this.isLoading = false;
      }, error => {
        console.error('Error loading notifications:', error);
        this.isLoading = false;
      });
  }

  getFlaselNotificationsForAdmin(): void {
    this.notificationService.getFalseNotificationsForUser(this.notificationService.idUserLogin).subscribe(notif => {
      this.notifsFlase = notif;
    });
  }

  markNotificationsAsRead(): void {
    this.notificationService.markNotificationsAsRead(this.notifsFlase).subscribe(response => {
      console.log('Notifications marked as read:', response);
    });
  }

  calculateTimeDifference(createdAt: string): string {
    const notificationDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - notificationDate.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays > 0) {
      return `${differenceInDays} days ago`;
    } else if (differenceInHours > 0) {
      return `${differenceInHours} hours ago`;
    } else if (differenceInMinutes > 0) {
      return `${differenceInMinutes} minutes ago`;
    } else {
      return 'a few moments ago';
    }
  }

  delete(idNotif: string): void {
    this.notificationService.deleteNotification(idNotif).subscribe(response => {
      console.log('Notification deleted:', response);
      this.notifs = this.notifs.filter(notif => notif.id !== idNotif);
    });
  }

  loadMoreNotifications(): void {
    this.loadNotifications();
  }
}
