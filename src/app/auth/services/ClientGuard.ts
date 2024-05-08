import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserServiceService } from "./user-service.service";
import { CookieService } from "ngx-cookie-service";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ClientGuard implements CanActivate {
  
    constructor(private router: Router, private cookieService: CookieService, private userService: UserServiceService) { }
  
    canActivate(): Observable<boolean> {
      const jwtToken = this.cookieService.get('jwtToken');
      
      return this.userService.checkRole(jwtToken).pipe(
        map(roles => {
        if (roles.includes('CLIENT')) { // Vérifier si 'ADMIN' est présent dans les rôles
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
    }
  }
  
