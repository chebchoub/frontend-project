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
import { HomeTechnicienComponent } from './technicien/home-technicien/home-technicien.component';
import { ErreurPageComponent } from './auth/erreur-page/erreur-page.component';
import { ContractComponent } from './Client/contract/contract.component';
import { CreateTicketComponent } from './Client/create-ticket/create-ticket.component';
import { DashboardClientComponent } from './Client/dashboard-client/dashboard-client.component';
import { TicketsClientComponent } from './Client/tickets-client/tickets-client.component';
import { RatingTicketComponent } from './Client/rating-ticket/rating-ticket.component';
import { ProfileClientComponent } from './Client/profile-client/profile-client.component';
import { EnterPasswordComponent } from './Client/enter-password/enter-password.component';
import { UpdateProfilePasswordComponent } from './Client/update-profile-password/update-profile-password.component';


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
    HomeTechnicienComponent,
    ErreurPageComponent,
    ContractComponent,
    CreateTicketComponent,
    DashboardClientComponent,
    TicketsClientComponent,
    RatingTicketComponent,
    ProfileClientComponent,
    EnterPasswordComponent,
    UpdateProfilePasswordComponent,
   
  ],
  imports: [
    BrowserModule ,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,

  ],
  providers: [    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  exports: [RatingTicketComponent
    
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { }
