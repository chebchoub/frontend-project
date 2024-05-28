import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { HomeadminComponent } from './admin/homeadmin/homeadmin.component';

import { ClientsComponent } from './admin/client/clients/clients.component';
import { ContratsComponent } from './admin/contract/contracts/contrats.component';
import { CreateContratComponent } from './admin/contract/create-contrat/create-contrat.component';
import { EditContractComponent } from './admin/contract/edit-contract/edit-contract.component';
import { ViewContractComponent } from './admin/contract/view-contract/view-contract.component';
import { SearchPipe } from './admin/search.pipe';
import { TechniciansComponent } from './admin/technician/technicians/technicians.component';
import { UpdateTechnicianComponent } from './admin/technician/update-technician/update-technician.component';
import { ViewTechnicianComponent } from './admin/technician/view-technician/view-technician.component';
import { CreateTechnicianComponent } from './admin/technician/create-technician/create-technician.component';
import { SendEmailComponent } from './admin/technician/send-email/send-email.component';
import { ViewClientComponent } from './admin/client/view-client/view-client.component';
import { SendEmailClientComponent } from './admin/client/send-email-client/send-email-client.component';
import { TicketsComponent } from './admin/ticket/tickets/tickets.component';
import { ViewTicketComponent } from './admin/ticket/view-ticket/view-ticket.component';
import { AssignedTicketComponent } from './admin/ticket/assigned-ticket/assigned-ticket.component';
import { EditTicketComponent } from './admin/ticket/edit-ticket/edit-ticket.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './auth/services/JwtInterceptor';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './auth/update-password/update-password.component';
import { ClientRegisterComponent } from './auth/client-register/client-register.component';
import { TechnicienRegisterComponent } from './auth/technicien-register/technicien-register.component';
import { SendCreateEmailComponent } from './admin/technician/send-create-email/send-create-email.component';
import { HomeClientComponent } from './Client/home-client/home-client.component';
import { ErreurPageComponent } from './auth/erreur-page/erreur-page.component';
import { ContractComponent } from './Client/contract/contract.component';
import { CreateTicketComponent } from './Client/create-ticket/create-ticket.component';
import { DashboardClientComponent } from './Client/dashboard-client/dashboard-client.component';
import { TicketsClientComponent } from './Client/tickets-client/tickets-client.component';
import { RatingTicketComponent } from './Client/rating-ticket/rating-ticket.component';
import { ProfileClientComponent } from './Client/profile-client/profile-client.component';
import { EnterPasswordComponent } from './Client/enter-password/enter-password.component';
import { UpdateProfilePasswordComponent } from './Client/update-profile-password/update-profile-password.component';
import { HomeTechnicianComponent } from './technician/home-technician/home-technician.component';
import { DashboardTechnicianComponent } from './technician/dashboard-technician/dashboard-technician.component';
import { TicketsTechnicienComponent } from './technician/tickets-technicien/tickets-technicien.component';
import { ProfileTechnicienComponent } from './technician/profile-technicien/profile-technicien.component';
import { ImageCompressService,ResizeOptions,ImageUtilityService } from 'ng2-image-compress';
import { CommentsComponent } from './technician/comments/comments.component';
import { AddCommentClientComponent } from './Client/add-comment-client/add-comment-client.component';
import { AddCommentAdminComponent } from './admin/ticket/add-comment-admin/add-comment-admin.component';
import { EnterPassworddComponent } from './technician/enter-passwordd/enter-passwordd.component';
import { UpdatePasswordProfileComponent } from './technician/update-password-profile/update-password-profile.component';
import { ManagersComponent } from './admin/manager/managers/managers.component';
import { ViewmManagerComponent } from './admin/manager/viewm-manager/viewm-manager.component';
import { SendEmailCreateManagerComponent } from './admin/manager/send-email-create-manager/send-email-create-manager.component';
import { RegisterManagerComponent } from './auth/register-manager/register-manager.component';
import { UserNotificationComponent } from './notification/user-notification/user-notification.component';
import { ManagerArchivedComponent } from './admin/archive/managesArchived/manager-archived/manager-archived.component';
import { TechnicienArchivedComponent } from './admin/archive/technicienArchived/technicien-archived/technicien-archived.component';
import { ClientsArchivedComponent } from './admin/archive/ClientsArchived/clients-archived/clients-archived.component';
import { ContractsArchivedComponent } from './admin/archive/contractsArchived/contracts-archived/contracts-archived.component';
import { AddContractToClientComponent } from './admin/client/add-contract-to-client/add-contract-to-client.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfileManagerComponent } from './admin/manager/profile-manager/profile-manager.component';
import { EnterPasswordManagerComponent } from './admin/manager/enter-password-manager/enter-password-manager.component';
import { UpdatePasswordManagerComponent } from './admin/manager/update-password-manager/update-password-manager.component';


@NgModule({
  declarations: [
    AppComponent,
    
    LoginComponent,
    HomeComponent,
    HomeadminComponent,
    ClientsComponent,
    ContratsComponent,
    CreateContratComponent,
    EditContractComponent,
    ViewContractComponent,
    ViewClientComponent,
    SearchPipe,
    TechniciansComponent,
    UpdateTechnicianComponent,
    ViewTechnicianComponent,
    CreateTechnicianComponent,
    SendEmailComponent,
    SendEmailClientComponent,
    TicketsComponent,
    ViewTicketComponent,
    AssignedTicketComponent,
    EditTicketComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    UpdatePasswordComponent,
    ClientRegisterComponent,
    TechnicienRegisterComponent,
    SendCreateEmailComponent,
    HomeClientComponent,
    ErreurPageComponent,
    ContractComponent,
    CreateTicketComponent,
    DashboardClientComponent,
    TicketsClientComponent,
    RatingTicketComponent,
    ProfileClientComponent,
    EnterPasswordComponent,
    UpdateProfilePasswordComponent,
    HomeTechnicianComponent,
    DashboardTechnicianComponent,
    TicketsTechnicienComponent,
    ProfileTechnicienComponent,
    CommentsComponent,
    AddCommentClientComponent,
    AddCommentAdminComponent,
    EnterPassworddComponent,
    UpdatePasswordProfileComponent,
    ManagersComponent,
    ViewmManagerComponent,
    SendEmailCreateManagerComponent,
    RegisterManagerComponent,
    UserNotificationComponent,
    ManagerArchivedComponent,
    TechnicienArchivedComponent,
    ClientsArchivedComponent,
    ContractsArchivedComponent,
    AddContractToClientComponent,
    ProfileManagerComponent,
    EnterPasswordManagerComponent,
    UpdatePasswordManagerComponent
    
   
  ],
  imports: [
    BrowserModule ,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
     

  ],
  providers: [  CommonModule,DatePipe,ImageCompressService,ResizeOptions,  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  exports: [RatingTicketComponent
    
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { }
