import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseComision } from '../../models/nissan/comisiones';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {

  constructor(private http: HttpClient) { }
    /**
     * Recupera datos de las ventas junto con los gastos para el calculo de comisiones
     * @param fecha_inicio limite inferior de la búsqueda
     * @param fecha_fin limite final de la búsqueda
     * @returns datos 
     */
    public getAll(fecha_inicio:any, fecha_fin:any): Observable<ResponseComision> {
      return this.http.get<ResponseComision>(environment.apiUrl + `nissan/comisiones/${fecha_inicio}/${fecha_fin}`);
    }
    /**
     * Recupera los porcentajes de los punto de ventas
     * @returns datos 
     */
    public getPorentajes(): Observable<any> {
      return this.http.get<any>(environment.apiUrl + `nissan/porcentajes`);
    }
    /**
     * Guarda los datos de gastos de una factura 
     * @param data datos de los gastos
     * @returns status, message, registro guardado 
     */
    public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "nissan/comisiones", data);
    }
    $emitter = new EventEmitter();
    /**
     * Ejecuta una función en otro componente
     */
    emitirEvento() {
        this.$emitter.emit();
    }   

}
