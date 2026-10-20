import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permisos, ResponsePermisos } from '../../models/ucoip/permisos';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

   constructor(private http: HttpClient) {}
  
    getModulos(): Observable<ResponsePermisos> {
      return this.http.get<ResponsePermisos>(environment.apiUrl + 'ucoip/permisos')
        .pipe(catchError(this.handleError));
    }
  
    getModulo(id: number): Observable<ResponsePermisos> {
      return this.http.get<ResponsePermisos>(`${environment.apiUrl}ucoip/permisos/${id}`)
        .pipe(catchError(this.handleError));
    }
  
    crearModulo(modulo: Permisos): Observable<ResponsePermisos> {
      return this.http.post<ResponsePermisos>(environment.apiUrl + 'ucoip/permisos', modulo)
        .pipe(catchError(this.handleError));
    }
  
    actualizarModulo(id: number, modulo: Permisos): Observable<ResponsePermisos> {
      return this.http.put<ResponsePermisos>(`${environment.apiUrl}ucoip/permisos/${id}`, modulo)
        .pipe(catchError(this.handleError));
    }
  
    eliminarModulo(id: number): Observable<ResponsePermisos> {
      return this.http.delete<ResponsePermisos>(`${environment.apiUrl}ucoip/permisos/${id}`)
        .pipe(catchError(this.handleError));
    }
  
    private handleError(error: HttpErrorResponse) {
      console.error('Error en la petición:', error);
      return throwError(() => new Error('Ocurrió un error al procesar la solicitud.'));
    }

    buscarPermisos(correo: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}all-permisos`, { correo });
  }

  // Guardar o actualizar permisos
  guardarPermisos(usuarioId: number, permisos: number[]): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}permisos/guardar`, {
      usuario_id: usuarioId,
      permisos
    });
  }


}
