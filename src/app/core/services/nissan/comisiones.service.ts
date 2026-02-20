import { HttpClient, HttpResponse } from '@angular/common/http';
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
     * Petición de consulta de datos mediante filtro
     * @param estado estatus de busqueda (1-5)
     * @param agencia intercompania de agencia buscada
     * @param tipoVenta tipo de venta (nu-semi)
     * @param fecha_inicio fehcha incial de busqueda
     * @param fecha_fin fecha final de búsqueda
     * @param vendedor id de vendedor
     * @returns data
     */
    public getLibroVentas(estado:any ,agencia: any, tipoVenta: any, fecha_inicio:any, fecha_fin:any, vendedor:any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + `autos/libro-ventas/${estado}/${agencia}/${tipoVenta}/${fecha_inicio}/${fecha_fin}/${vendedor}`);
    }

    /** Actualiza los registros y los marca como entregados (estatus:2) */
    public guardarEntregados(data:any): Observable<any> {
      return this.http.post(environment.apiUrl + "nissan/datos-venta", data);
    }

    /** Actualiza los registros y los marca como validados (estatus:4) */
    public guardarValidados(data:any): Observable<any> {
      return this.http.post(environment.apiUrl + "nissan/datos-venta/validados", data);
    }

    /** Actualiza un registro y lo marca como pagado (estatus:5) */
    public guardarPagado(id:any): Observable<any> {
      return this.http.get(environment.apiUrl + `nissan/datos-venta/pagado/${id}`);
    }

    /** Recupera todos los registros de vendedores de una agencia en especifico */
    public getVendedoresAgencia(id:any): Observable<any> {
      return this.http.get(environment.apiUrl + `nissan/vendedor/${id}`);
    }

    /** Devuelve la partida (registro) a un estado anterior */
    public devolverPartida(id ,data:any): Observable<any> {
      return this.http.put(environment.apiUrl + `nissan/datos-venta/${id}`, data);
    }

    /**
     * Recupera los porcentajes de los punto de ventas
     * @returns datos 
     */
    public getPorentajes(): Observable<any> {
      return this.http.get<any>(environment.apiUrl + `nissan/porcentajes`);
    }

   /**
    * Guarda los gastos capturados en el form (estatus:2)
    * @param data gastos capturados
    * @returns 
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

    descargarLibroVentas(estado:any ,agencia: any, tipoVenta: any, fecha_inicio:any, fecha_fin:any, vendedor:any) : Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}autos/descarga-libro-ventas/${estado}/${agencia}/${tipoVenta}/${fecha_inicio}/${fecha_fin}/${vendedor}`, {
      responseType: 'blob',
      observe: 'response' 
    });
  }

}
