import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrdenesCompraService {
  constructor(private http: HttpClient) {}
  /**
   * Recupera todas las ordenes de compra de la BD
   * @returns coleccion de ordenes de compras
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/OrdenesCompras");
  }

  /**
   * Recupera ordenes de compra por id
   * @param id id de la orden de compra a recuperar
   * @returns datos de una orden de orden especifica
   */
  public getOne(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/OrdenesCompras/${id}`);
  }

  /**
   * Envia datos al servidor para crear el registro de la orden de compra
   * @param data datos de orden de compra
   * @returns respuesta del servidor
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/OrdenesCompras", data);
  }
  /**
   * Alamacena (Actualiza) los comprobantes de pago
   * @param id id tupla incompleta de documentos_ordenes_compras
   * @param data archivos
   * (Se utiliza método post para trabajar con form data, pero se agrega _put dentro del form data)
   * @returns
   */
  public saveDocs1(id: number, data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + `compras/DocumentosOrdenesCompras/${id}`,data);
  }

  /**
   * Almacena las facturas de pago
   * @param data archivos pdf y xml
   * @returns
   */
  public saveDocs(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/DocumentosOrdenesCompras`, data);
  }

  /**
   * Actualiza la tupla de documentos orden compra
   * @param data archivo de comporbante de pago 
   * @returns
   */
  public edit(id: number, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/OrdenesCompras/${id}`, data);
  }

  /**
   * Actulize le status de orden de compra y solicitud compra a "cancelado"
   * @param id is_solicitudes_compras
   * @returns
   */
  public destroy(id: number): Observable<any> {
    return this.http.delete(
      environment.apiUrl + `compras/OrdenesCompras/${id}`
    );
  }

  /**
   * Petición para generar el formato de orden compra
   * @param id solicitud_compra_id
   * @returns pdf en binario
   */
  public pdfOrdenCompra(id: number): Observable<Blob> {
    return this.http.get(
      environment.apiUrl + `compras/consulta-datos-pdf/${id}`,
      { responseType: "blob" }
    );
  }

  /**
   * Petición pra realizar el update de orden compras a autorizado
   * Invoca el metodo en el backend para enviar un correo al proveedor
   * @param data (id_soliciud_compra, id_orden_compra)
   * @returns
   */
  public enviarSolicitudSurtido(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "compras/enviar-solicitud-surtido",
      data
    );
  }

  /**
   * Petición pra realizar el update de orden compras a autorizado
   * @param data (id_soliciud_compra, id_orden_compra)
   * @returns
   */
  public autorizarOrdenCompra(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "compras/autorizar-orden-compra",
      data
    );
  }

  /**
   * Peticin para leer un archivo xml
   * @param id orden de compra id
   * @returns datos del xml en json
   */
  public getContenidoXML(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/leer-xml/${id}`, {
      responseType: "json",
    });
  }

  public getDataXMLs(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/get-data-xml/${id}`);
  }

  /**
   * Petición al servidor para recuperar un rar con facturas
   * @param id id orden compra (clave foránea)
   * @returns rar como blob
   */
  public descargarFacturas(id: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/descargar-facturas/${id}`,
      { responseType: "blob" }
    );
  }
}
