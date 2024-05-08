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
import { HomeTechnicienComponent } from './technicien/home-technicien/home-technicien.component';
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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige le chemin vide vers 'home'
  { path: 'home', component: HomeComponent },

  { path: 'clientRegister', component: ClientRegisterComponent },
  { path: 'technicienRegister', component: TechnicienRegisterComponent},

  { path: 'login', component: LoginComponent },
  { path: 'updatePassword', component: UpdatePasswordComponent },
  { path: 'erreurPage', component: ErreurPageComponent },
  {
      path: 'homeAdmin', component: HomeadminComponent,   canActivate: [AdminGuard],
      children: [
        { path: '', redirectTo: 'dashboardAdmin', pathMatch: 'full' }, // Redirection de homeAdmin vers dashboardAdmin

        { path: 'dashboardAdmin', component: DashboardComponent,canActivate: [AdminGuard] },

          { path: 'clients', component: ClientsComponent ,canActivate: [AdminGuard] },
          {
              path: 'contracts', component: ContratsComponent,canActivate: [AdminGuard] 
             
          },
          {
            path: 'contractCheck/:id', component: ContratsComponent,canActivate: [AdminGuard] 

          },
          { path: 'technicians', component: TechniciansComponent ,canActivate: [AdminGuard] },
          { path: 'tickets', component: TicketsComponent,canActivate: [AdminGuard]  },
          { path: 'editTickets', component: EditTicketComponent ,canActivate: [AdminGuard] },

          { path: 'editTechnicians', component: UpdateTechnicianComponent ,canActivate: [AdminGuard] },
          { path: 'createTechnicians', component: CreateTechnicianComponent ,canActivate: [AdminGuard] },
          { path: 'viewTechnician', component: ViewTechnicianComponent ,canActivate: [AdminGuard] },
          { path: 'assigned', component: AssignedTicketComponent ,canActivate: [AdminGuard] },

            { path: 'createContract', component: CreateContratComponent ,canActivate: [AdminGuard] },
            { path: 'editContract', component: EditContractComponent,canActivate: [AdminGuard]  },
            { path: 'viewContract', component: ViewContractComponent ,canActivate: [AdminGuard] },
            {path:'viewClient',component:ViewClientComponent,canActivate: [AdminGuard] },
  { path: 'updatePassword', component: UpdatePasswordComponent },



          // Route enfant pour les détails du contrat
      ]
 
},
{
  path: 'homeClient', component: HomeClientComponent,canActivate: [ClientGuard],
  children: [
    { path: '', redirectTo: 'dashboardClient', pathMatch: 'full' }, // Redirection de homeClient vers dashboardClient

    { path: 'dashboardClient', component: DashboardClientComponent,canActivate: [ClientGuard]},

      { path: 'contract', component:ContractComponent,canActivate: [ClientGuard]},
      {path: 'tickets', component: TicketsClientComponent,canActivate: [ClientGuard]},      
      { path: 'createTicket', component:CreateTicketComponent,canActivate: [ClientGuard]},
      { path: 'profile', component:ProfileClientComponent,canActivate: [ClientGuard]},
      { path: 'updateProfilePassword', component: UpdateProfilePasswordComponent,canActivate: [ClientGuard] },

     


      // Route enfant pour les détails du contrat
  ]

},
{
  path: 'homeTechnicien', component: HomeTechnicienComponent

}





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
