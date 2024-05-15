import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { ServiceUserNotifService } from '../services/service-user-notif.service';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrl: './user-notification.component.css'
})
export class UserNotificationComponent implements OnInit, OnDestroy {


  notifs: any[] = [];
  private subscription!: Subscription;

  constructor(private notificationService: ServiceUserNotifService) { }

  ngOnInit(): void {
   this.getAllNotificationsForAdmin();
    this.getFlaselNotificationsForAdmin()
    
    // Actualiser les notifications toutes les 30 secondes
    this.subscription = interval(100).pipe(
      switchMap(() => this.notificationService.getAllNotificationsForUser(this.notificationService.idUserLogin))
    ).subscribe(notif => {
      this.notifs = notif;
      console.log('Notifications updated:', this.notifs);

    });
  
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAllNotificationsForAdmin(): void {
    this.notificationService.getAllNotificationsForUser(this.notificationService.idUserLogin).subscribe(notif => {
      this.notifs = notif;
      console.log(notif);
    });
  }
  notifsFlase: any[] = [];
  getFlaselNotificationsForAdmin(): void {
    this.notificationService.getFalseNotificationsForUser(this.notificationService.idUserLogin).subscribe(notif => {
      this.notifsFlase = notif;

    });

  }
  markNotificationsAsRead(): void {
    this.notificationService.markNotificationsAsRead(this.notifsFlase).subscribe(
      (response) => {
        console.log('Notifications marked as read:', response);
      }
    );

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
  delete(idNotif: string) {

    this.notificationService.deleteNotification(idNotif).subscribe(responce => {
     console.log(responce)

    });
  }
}

