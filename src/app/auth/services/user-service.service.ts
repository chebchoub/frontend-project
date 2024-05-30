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
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {


  public baseUrl = environment.apiUrl +'api/v1/auth';

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
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, request);
  }
  checkManager(jwtToken: string): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/check-manager/${jwtToken}`, );
  }
  checkSuperManager(jwtToken: string): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/check-super-manager/${jwtToken}`, );
  }
  checkRole(jwtToken: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/getRole/${jwtToken}`);
  }
  getEmailFromToken(jwtToken: string): Observable<string> {
    return this.http.get<any>(`${this.baseUrl}/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }
  checkTokenExpired(token: string): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/check-expired/${token}`, );
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, email);
  }
  resetPassword(request:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, request);
  }
  logout()
  {
    this.cookieService.deleteAll("jwtToken")
    this.router.navigate(['/home']);

  }
  changeSuperManagerPassword(managerId:string,newPassword:string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/change-super-manager-password/${managerId}?newPassword=${newPassword}`, null);
  }
  changeManagerPassword(managerId:string,newPassword:string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/change-manager-password/${managerId}?newPassword=${newPassword}`, null);
  }

  verifPasswordSuperManager(managerId:string,password: string): Observable<any> {
    return this.http.post<void>(`${this.baseUrl}/verify-super-manager-password/${managerId}?password=${password}`,null);
  }
  verifPasswordManager(managerId:string,password: string): Observable<any> {
    return this.http.post<void>(`${this.baseUrl}/verify-manager-password/${managerId}?password=${password}`,null);
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
