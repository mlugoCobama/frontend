import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {
  constructor(private http: HttpClient) { }
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/Cotizaciones');
  } 
  
  public getOne(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Cotizaciones/${id}`);
  }

  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/Cotizaciones', data);
  }

  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/Cotizaciones/${id}`, data);
  }

  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/Cotizaciones/${id}`);
  }

  public abrirArchivo(rutaArchivo: string){
    const url =  (environment.apiUrl + `compras/${rutaArchivo}`);
     window.open(url , '_blank')
  }
}
