import { Component, OnInit } from '@angular/core';
import { ClientServiceService } from '../Client/service/client-service.service';
import { FormBuilder } from '@angular/forms';
import { UserServiceService } from '../auth/services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  router: any;
  constructor(public serviceClient: ClientServiceService, private formBuilder: FormBuilder, public userService: UserServiceService, private cookieService: CookieService) { } 

ngOnInit(): void {
  const jwtToken = this.cookieService.get('jwtToken');
    this.userService.checkRole(jwtToken).subscribe(
      (response: string[]) => {
        if (Array.isArray(response) && response.length > 0) {
          this.role = response[0]; // Récupérer le premier élément du tableau
          if (this.role==='CLIENT') { // Vérifier si 'ADMIN' est présent dans les rôles
            this.link="/homeClient"
          } else {
            this.link="/login"

          }
          console.log(this.link)
        }
      }
    );
}
role:string="";
link:string="";
emailTN:string=" contact-tn@linsoft.xyz"
emailMC:string="contact-ma@linsoft.xyz"
emailDZ:string="contact-dz@linsoft.xyz"

}
