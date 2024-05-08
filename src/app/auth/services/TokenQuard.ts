import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserServiceService } from "./user-service.service";
import { Observable, map, of } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class TokenGuard implements CanActivate {
  
    constructor(private router: Router, private userService: UserServiceService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean> {
      const token = route.queryParams['token'];
      if (!token) {
        // Redirige vers une autre page si le token est absent
        this.router.navigate(['/erreurPage']); // Redirige vers la page d'accueil ou une autre page appropriée
        return of(false);
    }
  
      // Vérifie si le token est expiré en appelant la méthode checkTokenExpired
      return this.userService.checkTokenExpired(token).pipe(
        map(response => {
          if (response=== 'Le token est valide.') {
            return true; // Autorise l'accès si le token est valide
          } else {
            // Redirige vers une autre page si le token est expiré
            this.router.navigate(['/erreurPage']); // Redirige vers la page d'accueil ou une autre page appropriée
            return false;
          }
        })
      );
    }
  }