import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BehaviorSubject } from 'rxjs';


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
    return this.http.get(environment.apiUrl + `compras/Solicitudes/Macro/${intercompania}/${id}`);
  }

  /**
   * Recupera los auto-tanqes por intercompania
   * @returns dat auto-tanques
   */
  public getAutotanques(intercompania: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/recuperar-autotanques/${intercompania}`);
  }

  /**
   * Almacena los datos de la solicitud de compra
   * @param data datos de la solicitud de compra y detalles de la solicitud
   * @returns 
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/SolicitudesMacro", data);
  }

  public edit(id: number, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/SolicitudesMacro/${id}`, data);
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
