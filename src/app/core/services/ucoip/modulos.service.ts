import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Modulos, ResponseModulos } from '../../models/ucoip/modulos';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  constructor(private http: HttpClient) {}

  getModulos(): Observable<ResponseModulos> {
    return this.http.get<ResponseModulos>(environment.apiUrl + 'ucoip/modulos')
      .pipe(catchError(this.handleError));
  }

  getModulo(id: number): Observable<ResponseModulos> {
    return this.http.get<ResponseModulos>(`${environment.apiUrl}/ucoip/modulos/${id}`)
      .pipe(catchError(this.handleError));
  }

  crearModulo(modulo: Modulos): Observable<ResponseModulos> {
    return this.http.post<ResponseModulos>(environment.apiUrl + 'ucoip/modulos', modulo)
      .pipe(catchError(this.handleError));
  }

  actualizarModulo(id: number, modulo: Modulos): Observable<ResponseModulos> {
    return this.http.put<ResponseModulos>(`${environment.apiUrl}ucoip/modulos/${id}`, modulo)
      .pipe(catchError(this.handleError));
  }

  eliminarModulo(id: number): Observable<ResponseModulos> {
    return this.http.delete<ResponseModulos>(`${environment.apiUrl}ucoip/modulos/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud.'));
  }
}
