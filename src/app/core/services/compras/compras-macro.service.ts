import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BehaviorSubject } from 'rxjs';

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});


@Injectable({
  providedIn: 'root'
})
export class ComprasMacroService {

  constructor(private http: HttpClient) {}
  /**
   * Recupera todas las solicitudes compra
   * @returns colección con las ordenes de compra
   */
  public getAll(intercompania: number, id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Solicitudes/Macro/${intercompania}/${id}`, {headers});
  }

  /**
   * Recupera los auto-tanqes por intercompania
   * @returns dat auto-tanques
   */
  public getAutotanques(intercompania: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/recuperar-autotanques/${intercompania}`, {headers});
  }

  /**
   * Almacena los datos de la solicitud de compra
   * @param data datos de la solicitud de compra y detalles de la solicitud
   * @returns 
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/SolicitudesMacro", data, {headers});
  }

  public edit(id: number, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/SolicitudesMacro/${id}`, data, {headers});
  }

  private formDataSubject = new BehaviorSubject<any>(null);
  formData$ = this.formDataSubject.asObservable();

  actualizarFormData(data: any) {
    this.formDataSubject.next(data);
  }

  obtenerDatosActuales() {
    return this.formDataSubject.getValue();
  }


}
