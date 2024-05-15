import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from './user-service.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CombinedGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService, private userService: UserServiceService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const jwtToken = this.cookieService.get('jwtToken');
    
    // Exécute les deux gardes individuellement
    const adminGuard$ = this.userService.checkManager(jwtToken).pipe(
      catchError(error => {
        // Gestion des erreurs (par exemple, si le token JWT est invalide)
        this.router.navigate(['/home']);
        return of(false);
      })
    );

    const superManagerGuard$ = this.userService.checkSuperManager(jwtToken).pipe(
      catchError(error => {
        // Gestion des erreurs (par exemple, si le token JWT est invalide)
        this.router.navigate(['/home']);
        return of(false);
      })
    );

    // Combine les résultats des deux gardes et renvoie true si l'un d'eux retourne true
    return forkJoin([adminGuard$, superManagerGuard$]).pipe(
      map(([isAdmin, isSuperManager]) => {
        return isAdmin || isSuperManager;
      })
    );
  }
}
