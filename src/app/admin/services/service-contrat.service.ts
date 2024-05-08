import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContractRequest, ContractRequestPremium, ContractRequestStandart } from '../dto/contract';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceContratService {

  private apiUrl = 'http://localhost:8080/api/v1/admin/contract'; // Mettez votre URL backend ici
  constructor(private http: HttpClient) { }

  createContractStandart(contract: ContractRequestStandart): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, contract);
  }
  createContractPremium(contract: ContractRequestPremium): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, contract);
  }
  getAllContracts(): Observable<void[]> {
    // Utiliser pipe() et tap() pour affecter les données à contractsGolbal après la requête HTTP
    return this.http.get<void[]>(`${this.apiUrl}/getAll`)
  }
  editContract(contractRequest: ContractRequest, id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${id}`, contractRequest);
  }

  deleteContract(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getContractById(contractId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${contractId}`);
  }
  getContractByContractType(contractType: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByContractType/${contractType}`);
  }
  getContractByPremiumType(premiumType: string): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByPremiumType/${premiumType}`);
  }
  getByEndDateAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByEndDateAsc`);
  }

  // Méthode pour récupérer les contrats triés par date de fin (descendant)
  getByEndDateDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByEndDateDesc`);
  }

  // Méthode pour récupérer les contrats triés par nombre de tickets (ascendant)
  getByTicketsAsc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketsAsc`);
  }
  getCountByPremiumType(premiumType: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getCountByPremiumType/${premiumType}`);
  }
  // Méthode pour récupérer les contrats triés par nombre de tickets (descendant)
  getByTicketsDesc(): Observable<void[]> {
    return this.http.get<void[]>(`${this.apiUrl}/getByTicketsDesc`);
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
  getPageName:string="";
}
