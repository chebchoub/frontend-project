import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceUserNotifService {

  private apiUrl = 'http://localhost:8080/api/v1/notification'; // Mettez votre URL backend ici

  constructor(private http: HttpClient,private cookieService:CookieService) { }
  idUserLogin:string="";
  getFalseNotificationsForUser(userId:string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${userId}/false`);
  }
  getAllNotificationsForUser(userId: string, page: number, size: number): Observable<any> {
    return this.http.get<void[]>(`http://localhost:8080/api/v1/notification/${userId}?page=${page}&size=${size}`);
  }


  markNotificationsAsRead(notifications:any[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-as-read`,notifications);
  }
  deleteNotification(notifId: string): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/delete/${notifId}`,null);
  }
  ManagerLOGIN:any;
  modalOpen: boolean = false;
  selectedMangerEmail: string = "";
  selectedTicketId: string = "";
  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }
  closeModal() {
    this.modalOpen = false;
  }
  ConifrmerModalOpen: boolean = false;
  toggleModalConfirmer() {
    this.ConifrmerModalOpen = !this.ConifrmerModalOpen;
  }
  closeModalConfimer() {
    this.ConifrmerModalOpen = false;
  }
}
