import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { HomeadminComponent } from './admin/homeadmin/homeadmin.component';
import { ClientsComponent } from './admin/client/clients/clients.component';
import { ContratsComponent } from './admin/contract/contracts/contrats.component';
import { CreateContratComponent } from './admin/contract/create-contrat/create-contrat.component';
import { EditContractComponent } from './admin/contract/edit-contract/edit-contract.component';
import { ViewContractComponent } from './admin/contract/view-contract/view-contract.component';
import { ViewClientComponent } from './admin/client/view-client/view-client.component';
import { TechniciansComponent } from './admin/technician/technicians/technicians.component';
import { UpdateTechnicianComponent } from './admin/technician/update-technician/update-technician.component';
import { CreateTechnicianComponent } from './admin/technician/create-technician/create-technician.component';
import { ViewTechnicianComponent } from './admin/technician/view-technician/view-technician.component';
import { TicketsComponent } from './admin/ticket/tickets/tickets.component';
import { EditTicketComponent } from './admin/ticket/edit-ticket/edit-ticket.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminGuard } from './auth/services/AdminGuard';
import { UpdatePasswordComponent } from './auth/update-password/update-password.component';
import { ClientRegisterComponent } from './auth/client-register/client-register.component';
import { TechnicienRegisterComponent } from './auth/technicien-register/technicien-register.component';
import { HomeClientComponent } from './Client/home-client/home-client.component';
import { ClientGuard } from './auth/services/ClientGuard';
import { TechnicienGuard } from './auth/services/TechnicienGuard';
import { TokenGuard } from './auth/services/TokenQuard';
import { ErreurPageComponent } from './auth/erreur-page/erreur-page.component';
import { DashboardClientComponent } from './Client/dashboard-client/dashboard-client.component';
import { ContractComponent } from './Client/contract/contract.component';
import { TicketsClientComponent } from './Client/tickets-client/tickets-client.component';
import { CreateTicketComponent } from './Client/create-ticket/create-ticket.component';
import { RatingTicketComponent } from './Client/rating-ticket/rating-ticket.component';
import { ProfileClientComponent } from './Client/profile-client/profile-client.component';
import { UpdateProfilePasswordComponent } from './Client/update-profile-password/update-profile-password.component';
import { AssignedTicketComponent } from './admin/ticket/assigned-ticket/assigned-ticket.component';
import { HomeTechnicianComponent } from './technician/home-technician/home-technician.component';
import { DashboardTechnicianComponent } from './technician/dashboard-technician/dashboard-technician.component';
import { TicketsTechnicienComponent } from './technician/tickets-technicien/tickets-technicien.component';
import { ProfileTechnicienComponent } from './technician/profile-technicien/profile-technicien.component';
import { CommentsComponent } from './technician/comments/comments.component';
import { ViewmManagerComponent } from './admin/manager/viewm-manager/viewm-manager.component';
import { ManagersComponent } from './admin/manager/managers/managers.component';
import { SuperManagerGuard } from './auth/services/SuperManagerGuard';
import { CombinedGuard } from './auth/services/CombinedGuard ';
import { ManagerServiceService } from './admin/services/manager-service.service';
import { RegisterManagerComponent } from './auth/register-manager/register-manager.component';
import { ManagerArchivedComponent } from './admin/archive/managesArchived/manager-archived/manager-archived.component';
import { TechnicienArchivedComponent } from './admin/archive/technicienArchived/technicien-archived/technicien-archived.component';
import { ClientsArchivedComponent } from './admin/archive/ClientsArchived/clients-archived/clients-archived.component';
import { ContractsArchivedComponent } from './admin/archive/contractsArchived/contracts-archived/contracts-archived.component';
import { ProfileManagerComponent } from './admin/manager/profile-manager/profile-manager.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige le chemin vide vers 'home'
  { path: 'home', component: HomeComponent },

  { path: 'clientRegister', component: ClientRegisterComponent },
  { path: 'technicienRegister', component: TechnicienRegisterComponent},
  { path: 'managerRegister', component: RegisterManagerComponent, canActivate: [TokenGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'updatePassword', component: UpdatePasswordComponent },
  { path: 'erreurPage', component: ErreurPageComponent },
  {
    path: 'homeAdmin', component: HomeadminComponent, canActivate: [CombinedGuard],
    children: [
      { path: '', redirectTo: 'dashboardAdmin', pathMatch: 'full' }, // Redirection de homeAdmin vers dashboardAdmin

      { path: 'dashboardAdmin', component: DashboardComponent, canActivate: [CombinedGuard] },

      { path: 'clients', component: ClientsComponent, canActivate: [CombinedGuard] },
      {
        path: 'contracts', component: ContratsComponent, canActivate: [CombinedGuard]

      },
      {
        path: 'contractCheck/:id', component: ContratsComponent, canActivate: [CombinedGuard]

      },
      { path: 'technicians', component: TechniciansComponent, canActivate: [CombinedGuard] },
      { path: 'tickets', component: TicketsComponent, canActivate: [CombinedGuard] },
      { path: 'editTickets', component: EditTicketComponent, canActivate: [CombinedGuard] },

      { path: 'editTechnicians', component: UpdateTechnicianComponent, canActivate: [CombinedGuard] },
      { path: 'createTechnicians', component: CreateTechnicianComponent, canActivate: [CombinedGuard] },
      { path: 'viewTechnician', component: ViewTechnicianComponent, canActivate: [CombinedGuard] },
      { path: 'assigned', component: AssignedTicketComponent, canActivate: [CombinedGuard] },

      { path: 'createContract', component: CreateContratComponent, canActivate: [CombinedGuard] },
      { path: 'editContract', component: EditContractComponent, canActivate: [CombinedGuard] },
      { path: 'viewContract', component: ViewContractComponent, canActivate: [CombinedGuard] },
      { path: 'viewClient', component: ViewClientComponent, canActivate: [CombinedGuard] },

      { path: 'managers', component: ManagersComponent, canActivate: [SuperManagerGuard] },
      { path: 'viewManager', component: ViewmManagerComponent, canActivate: [SuperManagerGuard] },
      { path: 'ManagerProfile', component: ProfileManagerComponent },

      { path: 'managersArchvied', component: ManagerArchivedComponent, canActivate: [SuperManagerGuard] },
      { path: 'techniciensArchvied', component: TechnicienArchivedComponent, canActivate: [SuperManagerGuard] },
      { path: 'clientsArchived', component: ClientsArchivedComponent, canActivate: [SuperManagerGuard] },
      { path: 'contractsArchived', component: ContractsArchivedComponent, canActivate: [SuperManagerGuard] },
      { path: 'updatePassword', component: UpdatePasswordComponent },



      // Route enfant pour les détails du contrat
    ]

  },
  {
    path: 'homeClient', component: HomeClientComponent, canActivate: [ClientGuard],
    children: [
      { path: '', redirectTo: 'dashboardClient', pathMatch: 'full' }, // Redirection de homeClient vers dashboardClient
      { path: 'dashboardClient', component: DashboardClientComponent, canActivate: [ClientGuard] },
      { path: 'contract', component: ContractComponent, canActivate: [ClientGuard] },
      { path: 'tickets', component: TicketsClientComponent, canActivate: [ClientGuard] },
      { path: 'tickets/:id', component: TicketsClientComponent, canActivate: [ClientGuard] },

      { path: 'createTicket', component: CreateTicketComponent, canActivate: [ClientGuard] },
      { path: 'profile', component: ProfileClientComponent, canActivate: [ClientGuard] },
      { path: 'updateProfilePassword', component: UpdateProfilePasswordComponent, canActivate: [ClientGuard] },
      { path: 'rating', component: RatingTicketComponent, canActivate: [ClientGuard] },]

  }
  ,
  {
    path: 'homeTechnician', component: HomeTechnicianComponent, canActivate: [TechnicienGuard],
    children: [
      { path: '', redirectTo: 'dashboardTechnician', pathMatch: 'full' }, // Redirection de homeClient vers dashboardClient

      { path: 'dashboardTechnician', component: DashboardTechnicianComponent, canActivate: [TechnicienGuard] },
      { path: 'ticketsTechnician', component: TicketsTechnicienComponent, canActivate: [TechnicienGuard] },
      { path: 'ticketsTechnician/:id', component: TicketsTechnicienComponent, canActivate: [TechnicienGuard] },

      { path: 'profileTechnician', component: ProfileTechnicienComponent, canActivate: [TechnicienGuard] },
      { path: 'comments', component: CommentsComponent, canActivate: [TechnicienGuard] },





      // Route enfant pour les détails du contrat
    ]

  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
