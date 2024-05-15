import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerServiceService {

  private apiUrl = 'http://localhost:8080/api/v1/admin/super-manager'; // Mettez votre URL backend ici

  constructor(private http: HttpClient,private cookieService:CookieService) { }
  ManagerLOGINID:string="";
  getAllManager(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByNonArchiver`);
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
    return this.http.get<any>(`${this.apiUrl}/getByEmail/${email}`);
  }
  deleteManager(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete/${id}`,"");
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
