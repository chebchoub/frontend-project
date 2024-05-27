import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from './user-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService, private userService: UserServiceService) { }

  canActivate(): Observable<boolean> {
    const jwtToken = this.cookieService.get('jwtToken');
    
    return this.userService.checkManager(jwtToken).pipe(
      map(isAdmin => {
        if (isAdmin  ) {
            console.log()

          return true;
        } else {
            this.router.navigate(['/home']);

          return false;
          
        }
      })
    );
  }
}
