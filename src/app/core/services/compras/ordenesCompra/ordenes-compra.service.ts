import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class OrdenesCompraService {
  constructor(private http: HttpClient) { }
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/OrdenesCompras');
  } 
  
  public getOne(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/OrdenesCompras/${id}`);
  }

  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/OrdenesCompras', data);
  }

  public saveDocs1(id:number, data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/DocumentosOrdenesCompras/${id}`, data);
  }

  public saveDocs(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/DocumentosOrdenesCompras/`, data);
  }

  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/OrdenesCompras/${id}`, data);
  }

  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/OrdenesCompras/${id}`);
  }

  public pdfOrdenCompra(id :number): Observable<Blob>{
    return this.http.get(
      environment.apiUrl + `compras/consulta-datos-pdf/${id}`,{ responseType: 'blob' });
  }

  public obtenerFolio(){
    return this.http.get<{ nuevoFolio: string }>(environment.apiUrl + `compras/generar-folio`);
  }

  public enviarSolicitudSurtido(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "compras/enviar-solicitud-surtido", data
    );
  }

  public autorizarOrdenCompra(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "compras/autorizar-orden-compra", data
    );
  }

  public getContenidoXML(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/leer-xml/${id}`, { responseType: 'json' });
  }

  public descargarFacturas(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/descargar-facturas/${id}`, { responseType: 'blob' });
  }

  // private handleError(error:HttpErrorResponse){
  //   if(error.error instanceof ErrorEvent){
  //     console.error('Erro')
  //   }
  // }

}

