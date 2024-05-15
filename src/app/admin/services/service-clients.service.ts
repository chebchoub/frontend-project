import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientRequest } from '../dto/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceClientsService {


  private apiUrl = 'http://localhost:8080/api/v1/admin/client'; // Mettez votre URL backend ici

  constructor(private http: HttpClient) { }
  getAllClients(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getAll`);
  }
  getClientDetailsById(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${clientId}`);
  }
  getClientContracts(clientId: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getContract/${clientId}`);
  }
  addContractToClient(clientId: string, contractId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/addContract/${clientId}/${contractId}`, {});
  }
  deleteClient(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${clientId}`);
  }
  getContractByContractType(contractType: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByContractType/${contractType}`);
  }
  // Méthode pour récupérer les contrats triés par nombre de tickets (ascendant)
  getByTicketsAvailableAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketsAvailableAsc`);
  }
  getContractByPremiumType(premiumType: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByPremiumType/${premiumType}`);
  }
  // Méthode pour récupérer les contrats triés par nombre de tickets (descendant)
  getByTicketsAvailableDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketsAvailableDesc`);
  }
  modalOpen: boolean = false;
  selectedClientId: string = "";
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
  updateClientTicketsAvailable(clientId: string, ticketsAvailable: number) {
    const updateRequest = { ticketsAvailable }; // Création de l'objet de requête
    return this.http.put(`${this.apiUrl}/ticketsAvailable/${clientId}`, updateRequest);
  }

}
