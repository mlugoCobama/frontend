import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/Proveedores');
  } 
  
  public abrirArchivo(rutaArchivo: string){
    const url =  (environment.apiUrl + `compras/${rutaArchivo}`);
     window.open(url , '_blank')
  }

  public getExp(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Proveedores/${id}`);
  }

  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/Proveedores', data);
  }

  public edit(id:number, data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/Proveedores/${id}`, data);
  }

  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/Proveedores/${id}`);
  }
}
