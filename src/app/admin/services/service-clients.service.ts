import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientRequest } from '../dto/client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceClientsService {


  private apiUrl = environment.apiUrl +'api/v1/admin/client'; // Mettez votre URL backend ici
  private apiUrlsuper = environment.apiUrl +'api/v1/admin/super-manager'; // Mettez votre URL backend ici

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

  deleteClient(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${clientId}`);
  }
  unarchiveclient(clientId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrlsuper}/unarchive-client/${clientId}`,null);
  }
  addContractToClient(clientId:string,contractSerialNumber:string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/addContract/${clientId}/${contractSerialNumber}`,null);
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
  // archiver Clients methods
  getAllClientsArchive(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getAll-clients-archived`);
  }
  getContractByContractTypeClientArchived(contractType: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByContractTypeClientArchived/${contractType}`);
  }
  // Méthode pour récupérer les contrats triés par nombre de tickets (ascendant)
  getByTicketsAvailableAscClientArchived(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByTicketsAvailableAscClientArchived`);
  }
  getContractByPremiumTypeClientArchived(premiumType: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByPremiumTypeClientArchived/${premiumType}`);
  }
  // Méthode pour récupérer les contrats triés par nombre de tickets (descendant)
  getByTicketsAvailableDescClientArchived(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrlsuper}/getByTicketsAvailableDescClientArchived`);
  }
  modalOpen: boolean = false;
  modalOpenAddContract: boolean = false;

  selectedClientId: string = "";
  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }
  toggleModalAddConttract() {
    this.modalOpenAddContract = !this.modalOpenAddContract;
  }
  closeModalAddConttract() {
    this.modalOpenAddContract = false;
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
