import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketRequest } from '../dto/ticket-request';
import { Observable, map, throwError } from 'rxjs';
import { TicketResponce } from '../dto/ticket-responce';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from '../../auth/services/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  private apiUrl = 'http://localhost:8080/api/v1/client'; // Mettez votre URL backend ici
  clientLogedIn:any;;
  constructor(private http: HttpClient, private cookieService: CookieService, public userService: UserServiceService) { }
  getClientByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getClientByEmail/${email}`);

  }
  getEmailFromToken(): Observable<string> {
    const jwtToken = this.cookieService.get('jwtToken');

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }

  createTicket(ticket: any, clientId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create-ticket/${clientId}`, ticket);
  }
  getTicketById(ticketId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTicketById/${ticketId}`);
  }
  getAllTicketByClient(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllTickets/${clientId}`);
  }
  getClientByID(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getClient/${clientId}`);
  }
  getByPiority(priority: string, clientId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${clientId}/getTicketsByPriority/${priority}`);
  }
  getByStatus(status: string, clientId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${clientId}/getTicketsByStatus/${status}`);
  }
  getByCategory(category: string, clientId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/${clientId}/getTicketsByCategory/${category}`);
  }
  getByTicketOpeningDateAsc(clientId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketOpeningDateAsc/${clientId}`);
  }

  getByTicketOpeningDateDesc(clientId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketOpeningDateDesc/${clientId}`);
  }
  getByTicketOpeningDateInLastWeek(priority: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/getByTicketOpeningDateInLastWeek/${priority}`);
  }
  addComent(commentRequest: any, ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/add-comment`, commentRequest);
  }
  updateClient(updateRequest: any, ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateClient/${ticketId}`, updateRequest);
  }
  ticketIDClosed: string = "";
  addRating(rating: number, ticketId: string): Observable<any> {
    // Utilisez HttpClient's put method pour inclure le rating dans l'URL
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/give-rating?rating=${rating}`, null);
  }
  markAsClosed(ticketId: string): Observable<any> {
    // Utilisez HttpClient's put method pour inclure le rating dans l'URL
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/markAsClosed`, null);
  }
  verifPassword(clientId:string,password: string): Observable<any> {
    return this.http.post<void>(`${this.apiUrl}/verify-password/${clientId}?password=${password}`,null);
  }
  changePassword(clientId:string,password: string): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/change-password/${clientId}?newPassword=${password}`,null);
  }
  
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
