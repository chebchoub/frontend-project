import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServiceContratService } from '../services/service-contrat.service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
import { ManagerServiceService } from '../services/manager-service.service';
import { ServiceUserNotifService } from '../../notification/services/service-user-notif.service';
import { TicketServiceService } from '../services/ticket-service.service';
import { SuperManagerService } from '../services/super-manager.service';

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
  isNotificationOpen: boolean = false;
  hasNewNotification: boolean = false;  // New flag to track new notifications
  manager: any;
  superManager:any;
  private size = 10;

  private refreshInterval!: Subscription;

  constructor(
    public superManagerService:SuperManagerService,
    public notificationService: ServiceUserNotifService,
    public contractService: ServiceContratService,
    public userService: UserServiceService,
    private cookieService: CookieService,
    private managerService: ManagerServiceService,
    private ticketService: TicketServiceService
  ) { }

  ngOnInit(): void {
    const jwtToken = this.cookieService.get('jwtToken');
    this.token = jwtToken;
    this.userService.checkSuperManager(jwtToken).subscribe(
      (response) => {
        this.checkSuperManager = response;
        if (this.checkSuperManager) {
          this.superManagerService.getEmailFromToken().subscribe(
            (response) => {
              this.emailManager = response;
              this.superManagerService.getManagerByEmail(this.emailManager).subscribe(superManager => {
                this.managerService.ManagerLOGINID=superManager;
                console.log(superManager.id)                
                this.superManager = superManager;
                this.notificationService.idUserLogin =superManager.id;
                this.setupAutoRefresh(superManager.id);

              });
            });
        } else {
          this.managerService.getEmailFromToken().subscribe(
            (response) => {
              this.emailManager = response;
              this.managerService.getManagerByEmail(this.emailManager).subscribe(manager => {
                this.managerService.ManagerLOGINID=manager;
                
                this.manager = manager;
                this.notificationService.idUserLogin =manager.id;
                this.setupAutoRefresh(manager.id);

              });
            });
        }
      }
    );
    this.getAllTicketByStatus("NEW");
   
  }

  tickets!: any[];

  getAllTicketByStatus(status: string): void {
    this.ticketService.getByStatus(status).subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
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
        this.hasNewNotification = false;
      }
    );
  }

  dropdownVisible: boolean = false;

  openPopUp: string = ";"

  toggleModalNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.hasNewNotification = false;  // Reset the flag when the modal is opened
    this.notificationService.toggleModal();
   
    setTimeout(() => {
      this.markNotificationsAsRead();
    }, 1000);
  }
}
