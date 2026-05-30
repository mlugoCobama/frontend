import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    //     if (environment.defaultauth === 'firebase') {
    //         const currentUser = this.authenticationService.currentUser();
    //         if (currentUser) {
    //             // logged in so return true
    //             return true;
    //         }
    //     } else {
    //         const currentUser = this.authFackservice.currentUserValue;
    //         if (currentUser) {
    //             // logged in so return true
    //             return true;
    //         }
    //         // check if user data is in storage is logged in via API.
    //         if (localStorage.getItem('currentUser')) {
    //             return true;
    //         }
    //     }
    //     // not logged in so redirect to login page with the return url
    //     this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    //     return false;
    // }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isAuthenticated = this.checkAuth();

    // 1. Si no está autenticado, manda al login
        if (!isAuthenticated) {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

    // 2. Si la ruta requiere un permiso mandarlo a una ruta default
        const requiredPermission = route.data['permission'];
        if (requiredPermission) {
            const hasPermission = this.checkPermission(requiredPermission);
            if (!hasPermission) {
                this.router.navigate(['/unauthorized']); // 404
                return false;
            }
        }
        return true;
    }

    // Validacion para saber si el suario esta uatenticado
    private checkAuth(): boolean {
        if (environment.defaultauth === 'firebase') {
            return !!this.authenticationService.currentUser();
        } else {
            if (this.authFackservice.currentUserValue) return true;
            if (localStorage.getItem('currentUser')) return true;
            return false;
        }
    }

    // Valida que el usuario tenga permiso para acceder al modulo
    private checkPermission(requiredPermission: string): boolean {
        try {
            const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const rawPermissions: string[] = userData.permisos || [];
            const permissions = rawPermissions.map((p: any) => p.name);
            return permissions.includes(requiredPermission);
        } catch {
            return false;
        }
    }
}
