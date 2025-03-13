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
  /**
   * Alamacena (Actualiza) los comprobantes de pago
   * @param id id tupla incompleta de documentos_ordenes_compras
   * @param data archivos
   * (Se utiliza método post para trabajar con form data, pero se agrega _put dentro del form data)
   * @returns 
   */
  public saveDocs1(id:number, data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/DocumentosOrdenesCompras/${id}`, data);
  }

    /**
   * Almacena las facturas de pago
   * @param data archivos pdf y xml
   * @returns 
   */
  public saveDocs(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/DocumentosOrdenesCompras/`, data);
  }

  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/OrdenesCompras/${id}`, data);
  }

  /**
   * Actulize le status de orden de compra y solicitud compra a "cancelado"
   * @param id is_solicitudes_compras
   * @returns 
   */
  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/OrdenesCompras/${id}`);
  }

  /**
   * Petición para generar el formato de orden compra
   * @param id solicitud_compra_id
   * @returns pdf en binario
   */
  public pdfOrdenCompra(id :number): Observable<Blob>{
    return this.http.get(
      environment.apiUrl + `compras/consulta-datos-pdf/${id}`,{ responseType: 'blob' });
  }

  /**
   * Genera un folio consecutivo para la ordenes de compra
   * @returns folio consecutivo basado en el ultimo guardado en bd
   */
  public obtenerFolio(){
    return this.http.get<{ nuevoFolio: string }>(environment.apiUrl + `compras/generar-folio`);
  }

    /**
   * Petición pra realizar el update de orden compras a autorizado
   * Invoca el metodo en el backend para enviar un correo al proveedor
   * @param data (id_soliciud_compra, id_orden_compra)
   * @returns 
   */
  public enviarSolicitudSurtido(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "compras/enviar-solicitud-surtido", data
    );
  }

  /**
   * Petición pra realizar el update de orden compras a autorizado
   * @param data (id_soliciud_compra, id_orden_compra)
   * @returns 
   */
  public autorizarOrdenCompra(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/autorizar-orden-compra", data);
  }

  /**
   * Peticin para leer un archivo xml
   * @param id orden de compra id
   * @returns datos del xml en json
   */
  public getContenidoXML(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/leer-xml/${id}`, { responseType: 'json' });
  }

  /**
   * Petición al servidor para recuperar un rar con facturas
   * @param id id orden compra (clave foranea)
   * @returns rar como blob
   */

  public descargarFacturas(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/descargar-facturas/${id}`, { responseType: 'blob' });
  }

  // private handleError(error:HttpErrorResponse){
  //   if(error.error instanceof ErrorEvent){
  //     console.error('Erro')
  //   }
  // }

}

