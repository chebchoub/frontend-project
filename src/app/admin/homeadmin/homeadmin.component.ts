import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServiceContratService } from '../services/service-contrat.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
import { ManagerServiceService } from '../services/manager-service.service';
import { ServiceUserNotifService } from '../../notification/services/service-user-notif.service';

@Component({
  selector: 'app-homeadmin',
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit, OnDestroy {
  navigationIndex: number = 0;
  emailManager: string = "";
  token: string = "";
  notifs: any[] = [];
  checkSuperManager: boolean = false;

  manager: any;
  isNotificationOpen: boolean = false;
  private notificationSubscription!: Subscription;

  constructor(
    public notificationService: ServiceUserNotifService,
    public contractService: ServiceContratService,
    public userService: UserServiceService,
    private cookieService: CookieService,
    private managerService: ManagerServiceService
  ) { }

  ngOnInit(): void {
    const jwtToken = this.cookieService.get('jwtToken');
    this.token = jwtToken;
    this.userService.checkSuperManager(jwtToken).subscribe(
      (response) => {
        this.checkSuperManager = response;
        if (this.checkSuperManager == true) {
          this.notificationService.idUserLogin = "66268a264adef845b1edf1fb"

          this.getFalseNotificationsForAdmin("66268a264adef845b1edf1fb");

          this.notificationSubscription = interval(100).pipe(
            switchMap(() => this.notificationService.getFalseNotificationsForUser("66268a264adef845b1edf1fb"))
          ).subscribe(notif => {
            this.notifs = notif;
            if (this.notifs.length > 0) {
              this.isNotificationOpen = true;
            }
          });
        }
        else {
          this.managerService.getEmailFromToken().subscribe(
            (response) => {
              this.emailManager = response;

              this.managerService.getManagerByEmail(this.emailManager).subscribe(manager => {
                this.manager = manager;


                this.notificationService.idUserLogin = manager.id;

                this.getFalseNotificationsForAdmin(manager.id);

                this.notificationSubscription = interval(100).pipe(
                  switchMap(() => this.notificationService.getFalseNotificationsForUser(manager.id))
                ).subscribe(notif => {
                  this.notifs = notif;
                  if (this.notifs.length > 0) {
                    this.isNotificationOpen = true;
                  }
                });

              });
            });
        }
      }
    );





  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }


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

  logoutAdmin() {
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

  openPopUp: string = ";"

  toggleModalNotification() {
    this.notificationService.toggleModal();
    this.isNotificationOpen = false;

    setTimeout(() => {
      this.markNotificationsAsRead()
    }, 7000);
  }
}
