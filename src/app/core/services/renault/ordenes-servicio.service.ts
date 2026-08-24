import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenesServicioService {
  constructor(private http: HttpClient) { }

  getAll(intercompania:any) {
    return this.http.get<any>(`${environment.apiUrl}renault/visor-citas/${intercompania}`);
  }

  getOne( id: number) {
    return this.http.get<any>(`${environment.apiUrl}renault/visor-citas/datos-ingreso/${id}`);
  }

    update(id:any, data: any) {
    return this.http.post<any>(`${environment.apiUrl}renault/visor-citas/${id}`, data)
  }

  descargarPdfOrdenServicio(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}renault/visor-citas/orden-servicio/${id}`, {
      responseType: 'blob' // importante para recibir el archivo binario
    });
  }

  getDataFilter(intercompania:any, apv: any, fechaInicial:any, fechaFinal:any  ) {
    return this.http.get<any>(
      `${environment.apiUrl}renault/visor-citas/${intercompania}/${apv}/${fechaInicial}/${fechaFinal}`
    );
  }

  getAps( id: number) {
    return this.http.get<any>(`${environment.apiUrl}renault/aps/${id}`);
  }

}
