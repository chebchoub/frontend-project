import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceTechnicianService {

  private apiUrl =environment.apiUrl + 'api/v1/admin/technician'; // Mettez votre URL backend ici
  private apiUrlsuper = environment.apiUrl +'api/v1/admin/super-manager'; // Mettez votre URL backend ici

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
  unarchivetechnician(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlsuper}/unarchive-technician/${id}`,null);
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
  reassignTicketToTechnician(ticketId: string,technicenId:string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reassignTicketToTechnician/${ticketId}/${technicenId}`,null);
  }
  sendEmailToCreate(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlsuper}/send-register-mail`, email);
  }

  //get archived
  getAllArchivedTechnicians(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getAll-technicians-archived`);
  }
    getBySpecialityarchived(speciality: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getBySpeciality-archived/${speciality}`);
  }

  getByRatingAscarchived(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByTicketResolvedRatingAsc-archived`);
  }

  getByRatingDescarchived(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByTicketResolvedRatingDesc-archived`);
  }
  getByStartDateWorkAscarchived(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByStartDateWorkAsc-archived`);
  }

  getByStartDateWorkDescarchived(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByStartDateWorkDesc-archived`);
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
