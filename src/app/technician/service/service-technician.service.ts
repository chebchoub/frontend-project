import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from '../../auth/services/user-service.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTechnicianService {
  

  private apiUrl = 'http://localhost:8080/api/v1/technician'; // Mettez votre URL backend ici
technicianLogedIn:any;;
  constructor(private http: HttpClient, private cookieService: CookieService, public userService: UserServiceService) { }
  getTechnicianByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTechnicianByEmail/${email}`);

  }
  getEmailFromToken(): Observable<string> {
    const jwtToken = this.cookieService.get('jwtToken');

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }
  getAllTicketWaitingList(technicianId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getTicketsWaitingList/${technicianId}`);
  }
  getTickets(technicianId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${technicianId}/getTickets`);
  }
  getTicketById(ticketId:string,technicianId:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTicket/${technicianId}/${ticketId}`);
  }
  updateUpdateTechnicien(updateRequest: any, technicianId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-technician/${technicianId}`, updateRequest);
  }
  updateUpdateTechnicienSpecialitie(specialities: string[], technicianId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-specialities/${technicianId}`, specialities);
  }
  addComent(commentRequest: any, ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/add-comment`, commentRequest);
  }
  getByPiority(priority: string, technicianId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${technicianId}/getTicketsByPriority/${priority}`);
  }
  getByStatus(status: string, technicianId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${technicianId}/getTicketsByStatus/${status}`);
  }
  getByCategory(category: string, technicianId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${technicianId}/getTicketsByCategory/${category}`);
  }
  getByTicketOpeningDateAsc(technicianId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${technicianId}/openingDateAsc`);
  }

  getByTicketOpeningDateDesc(technicianId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${technicianId}/openingDateDesc`);
  }
  verifPassword(technicianId:string,password: string): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/verify-password/${technicianId}?password=${password}`,null);
  }
  changePassword(technicianId:string,password: string): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/change-password/${technicianId}?newPassword=${password}`,null);
  }
  updateTechnicianRating(technicianId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${technicianId}/rating`, null);
  }
  ticketSelected:any;
  modalOpen: boolean = false;
  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }
  ConifrmerModalOpen: boolean = false;
  toggleModalConfirmer() {
    this.ConifrmerModalOpen = !this.ConifrmerModalOpen;
  }
  closeModal() {
    this.modalOpen = false;
  }
  closeModalConfimer() {
    this.ConifrmerModalOpen = false;
  }
  getPageName:string="";
}
