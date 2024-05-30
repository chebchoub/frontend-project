import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerServiceService {

  private apiUrl = environment.apiUrl +'api/v1/admin/manager'; // Mettez votre URL backend ici
  private apiUrlsuper = environment.apiUrl +'api/v1/admin/super-manager'; // Mettez votre URL backend ici
  private apiUrlauth = environment.apiUrl +'api/v1/auth'; // Mettez votre URL backend ici

  constructor(private http: HttpClient,private cookieService:CookieService) { }
  ManagerLOGINID:any;
  getAllManager(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByNonArchiver`);
  }
  ArchivedManager(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlsuper}/getAll-managers-archived`);
  }
  unarchiveManager(email:string): Observable<void[]> {
    return this.http.post<void[]>(`${this.apiUrlsuper}/unarchive-manager/${email}`,null);
  }
  getEmailFromToken(): Observable<string> {
    const jwtToken = this.cookieService.get('jwtToken');

    return this.http.get<any>(`${this.apiUrlauth}/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }
  sendEmailToCreate(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlsuper}/send-register-mail`, email);
  }
  getManagerByEmail(email: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getByEmail/${email}`);
  }
  deleteManager(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete/${id}`,"");
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
