import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerServiceService {

  private apiUrl = 'http://localhost:8080/api/v1/admin/manager'; // Mettez votre URL backend ici

  constructor(private http: HttpClient,private cookieService:CookieService) { }
  ManagerLOGINID:any;
  getAllManager(): Observable<void[]> {
    return this.http.get<void[]>(`http://localhost:8080/api/v1/admin/super-manager/getByNonArchiver`);
  }
  ArchivedManager(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/super-manager/getAll-managers-archived`);
  }
  unarchiveManager(email:string): Observable<void[]> {
    return this.http.post<void[]>(`http://localhost:8080/api/v1/admin/super-manager/unarchive-manager/${email}`,null);
  }
  getEmailFromToken(): Observable<string> {
    const jwtToken = this.cookieService.get('jwtToken');

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }
  sendEmailToCreate(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-register-mail`, email);
  }
  getManagerByEmail(email: string): Observable<any>{
    return this.http.get<any>(`http://localhost:8080/api/v1/admin/manager/getByEmail/${email}`);
  }
  deleteManager(id: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/v1/admin/super-manager/delete/${id}`,"");
  }
  updateManager(managerId:string,manager:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${managerId}`,manager);
  }

  
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
