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

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/SolicitudesCompras");
  }

  public getOne(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/SolicitudesCompras/${id}`);
  }

  public getSolicitudCompra(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/SolicitudCompra/${id}`);
  }

  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/SolicitudesCompras", data);
  }

  public edit(id: number, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/SolicitudesCompras/${id}`, data);
  }

  public destroy(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/SolicitudesCompras/${id}`);
  }

  //Enviar email de solicitud de cotización
  public sendMail(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/enviar-solicitud-cotizacion", data);
  }

  //Servicio para mostrar el apartado de cotización
  cambiarEstadoCotizacion(mostrar: boolean) {
    this.mostrarCotizacionSource.next(mostrar);
  }

  actualizarSolicitud() {
    this.actualizarEstatusSubject.next();
  }

  //Ejecuta la función generar orden desde el componente compras
  triggerGenerateOrder() {
    this.generateOrderSubject.next();
  }
  
  //Muestra el boton generar orden 
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
