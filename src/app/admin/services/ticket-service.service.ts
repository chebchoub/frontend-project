import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketServiceService {
  private apiUrl = environment.apiUrl + 'api/v1/admin/ticket';


  constructor(private http: HttpClient) { }
  getAllTicket(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByNonArchiver`);
  }
  getTicketById(id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }
  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
  getByPiority(priority: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByPiority/${priority}`);
  }
  getByStatus(status: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByStatus/${status}`);
  }
  getByTicketOpeningDateAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketOpeningDateAsc`);
  }

  getByTicketOpeningDateDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketOpeningDateDesc`);
  }
  getByTicketOpeningDateInLastWeek(priority:string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/getByTicketOpeningDateInLastWeek/${priority}`);
  }
  addComent(commentRequest: any, ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/add-comment`, commentRequest);
  }
  modalOpen: boolean = false;
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
  editTicket(ticketRequest: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${id}`, ticketRequest);
  }
}
