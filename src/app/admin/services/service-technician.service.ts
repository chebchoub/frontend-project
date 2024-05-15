import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTechnicianService {

  private apiUrl = 'http://localhost:8080/api/v1/admin/technician'; // Mettez votre URL backend ici

  constructor(private http: HttpClient) { }
  getAllTechnician(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByNonArchiver`);
  }
  deleteTechnician(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete/${id}`,"");
  }
  editTechnician(technicianRequest: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${id}`, technicianRequest);
  }
  getTechnicianById(id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }
  getByRatingAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketResolvedRatingAsc`);
  }

  getByRatingDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketResolvedRatingDesc`);
  }
  getByTicketWaitingListAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketWaitingListAsc`);
  }
  getByTicketWaitingListDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketWaitingListDesc`);
  }
  getByStartDateWorkAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByStartDateWorkAsc`);
  }

  getByStartDateWorkDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByStartDateWorkDesc`);
  }
  getBySpeciality(speciality: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getBySpeciality/${speciality}`);
  }
  addTicketToTechnicien(ticketId: string,technicenId:string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/addTicketToTechnician/${ticketId}/${technicenId}`,null);
  }
  sendEmailToCreate(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-register-mail`, email);
  }
  modalOpen: boolean = false;
  selectedTechniciaId: string = "";
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
