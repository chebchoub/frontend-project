import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperManagerService {


  private apiUrl = 'http://localhost:8080/api/v1/admin/super-manager'; // Mettez votre URL backend ici
  checkSuperManager:boolean=false;

  constructor(private http: HttpClient,private cookieService:CookieService) { }
  getEmailFromToken(): Observable<string> {
    const jwtToken = this.cookieService.get('jwtToken');

    return this.http.get<any>(`http://localhost:8080/api/v1/auth/getSubject/${jwtToken}`)
      .pipe(
        map(response => response.subject as string) // Extrayez l'adresse e-mail de la propriété "subject"
      );
  }
  getManagerByEmail(email: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getByEmail/${email}`);
  }
  updateSuperManager(managerId:string,manager:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${managerId}`,manager);
  }

}
