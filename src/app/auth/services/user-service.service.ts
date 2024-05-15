import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from '../model/user';
import { AuthenticationResponse } from '../model/authentication-response';
import { AuthenticationRequest } from '../model/authentication-request';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ClientRequest } from '../model/client-request';

import { map } from 'rxjs/operators';
import { TechnicienRequest } from '../model/technicien-request';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {


  public baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient,private cookieService: CookieService, private router: Router) {}
  role:string="";
  registerClient(request: ClientRequest): Observable<any> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/clientRegister`, request);
  }
  registerTechnician(request: TechnicienRequest,token:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register-technician/${token}`, request);
  }
  registerManager(request: TechnicienRequest,token:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register-manager/${token}`, request);
  }
  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`http://localhost:8080/api/v1/auth/authenticate`, request);
  }
  checkManager(jwtToken: string): Observable<any> {

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/check-manager/${jwtToken}`, );
  }
  checkSuperManager(jwtToken: string): Observable<any> {

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/check-super-manager/${jwtToken}`, );
  }
  checkRole(jwtToken: string): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8080/api/v1/auth/getRole/${jwtToken}`);
  }
  getEmailFromToken(jwtToken: string): Observable<string> {
    return this.http.get<any>(`http://localhost:8080/api/v1/auth/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }
  checkTokenExpired(token: string): Observable<any> {

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/check-expired/${token}`, );
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/v1/auth/forgot-password`, email);
  }
  resetPassword(request:any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/v1/auth/reset-password`, request);
  }
  logout()
  {
    this.cookieService.deleteAll("jwtToken")
    this.router.navigate(['/home']);

  }
  modalOpen: boolean = false;
  selectedContractId: string = "";
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
