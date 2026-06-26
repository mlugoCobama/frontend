import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private authFackservice: AuthfakeauthenticationService,) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                Swal.fire({
                    title: 'Tu sesión caduco',
                    text: 'Inicia sesión nuevamente.',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });

                if (environment.defaultauth === 'firebase') {
                this.authenticationService.logout();
                }else{
                    this.authFackservice.logout();
                }
            }

            if (err.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'Lo sentimos',
                    text: 'La función que intentas usar no está disponible',
                    confirmButtonText: 'OK'
                });
            }

            if (err.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error interno',
                    text: 'Ha ocurrido un problema en el servidor. Intenta más tarde.',
                    confirmButtonText: 'OK'
                });
            }


            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
