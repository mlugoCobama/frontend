import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  public mostrarCotizacionSource = new BehaviorSubject<boolean>(false); 
  mostrarCotizacion$ = this.mostrarCotizacionSource.asObservable();

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/SolicitudesCompras');
  } 
  public getOne(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/SolicitudesCompras/${id}`);
  }

  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/SolicitudesCompras', data);
  }
  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/SolicitudesCompras/${id}`, data);
  }

  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/SolicitudesCompras/${id}`);
  }

  //Enviar email de solicitud de cotización
  public sendMail(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/enviar-solicitud-cotizacion', data);
  }

 //Servicio para mostrar el apartado de cotización 
 cambiarEstadoCotizacion(mostrar: boolean) { 
    this.mostrarCotizacionSource.next(mostrar);
  }
}
