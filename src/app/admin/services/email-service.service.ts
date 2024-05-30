import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Technician } from '../dto/technicien';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

  constructor(private http: HttpClient) { }
  private EmailbaseUrl = environment.apiUrl +'api/v1/email';
  technicien:any;
  titreTicket:string=""
  dateouverture:string=""
  client:any;
  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const emailData = {
      to: to,
      subject: subject,
      body: body
    };
    return this.http.post<any>(`${this.EmailbaseUrl}/sendEmail`,emailData)
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
}
