import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ComprasService {

  public mostrarCotizacionSource = new BehaviorSubject<boolean>(false);
  public actualizarEstatusSubject = new Subject<void>();
  private mostrarBotonSource = new BehaviorSubject<boolean>(false);
  private generateOrderSubject = new Subject<void>();
  mostrarCotizacion$ = this.mostrarCotizacionSource.asObservable();
  generateOrder$ = this.generateOrderSubject.asObservable();
  mostrarBoton$ = this.mostrarBotonSource.asObservable();
  actualizarEstatus$ = this.actualizarEstatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Recupera todas las solicitudes compra
   * @returns colección con las ordenes de compra
   */
  public getAll(intercompania): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Solicitudes/${intercompania}`);
  }
  // public getAll(): Observable<any> {
  //   return this.http.get(environment.apiUrl + "compras/SolicitudesCompras");
  // }

  /**
   * Recupera los datos de la solicitud de compra seleccionado
   * @returns detalles de la solicitud de compra
   */
  public getOne(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/SolicitudesCompras/${id}`);
  }
  /**
   * Recupera los datos de la solicitud de compra seleccionado
   * @returns datos de la solicitud de compra
   */
  public getSolicitudCompra(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/SolicitudCompra/${id}`);
  }

  /**
   * Almacena los datos de la solicitud de compra
   * @param data datos de la solicitud de compra y detalles de la solicitud
   * @returns 
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/SolicitudesCompras", data);
  }
  

  public edit(id: number, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/SolicitudesCompras/${id}`, data);
  }

  /**
   * Marca como cancelado elemento con el id proporcionado de la tabla solicitudes Compras
   * @param id id del elemento a cancelar
   * @returns solicitud con estatus cancelada
   */
  public destroy(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/SolicitudesCompras/${id}`);
  }

  /**
   * Enviar email de solicitud de cotización a proveedores 
   * @param data proveedor1, proveedor2, proveedor3, idSolicitud, consideraciones
   * @returns respuesta del servidor
   */
  public sendMail(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/enviar-solicitud-cotizacion", data);
  }

  /**
   * Servicio para mostrar el apartado de cotización
   * @param mostrar true:muestra el div, false: oculta el div
   */
  cambiarEstadoCotizacion(mostrar: boolean) {
    this.mostrarCotizacionSource.next(mostrar);
  }
  /**
   * Actualiza el estatus desde cualquie componente
   * @todo aun no esta terminado
   */
  actualizarSolicitud() {
    this.actualizarEstatusSubject.next();
  }

  /**
   * Ejecuta la función generar orden desde el componente compras
   */
  triggerGenerateOrder() {
    this.generateOrderSubject.next();
  }
  
  /**
   * Muestra el boton generar orden
   * @param mostrar true:muestra el boton, false: oculta el boton
   */
  setMostrarBoton(mostrar: boolean) {
    this.mostrarBotonSource.next(mostrar);
  }

  private status = new BehaviorSubject <any>(null);
  status$ = this.status.asObservable();

  setValor(value: any){
    this.status.next(value);
  }

  get valorActual(){
    return this.status.getValue();
  }
}
