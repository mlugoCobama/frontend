import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  constructor(private http: HttpClient) { }

  /**
   * Recupera todos los datos de proveedores
   * @returns colección de datos de proveedores
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/Proveedores', {headers});
  } 
  
  /**
   * recupera una colección especifica de datos de proveedores
   * @returns colección de datos {nombre, id}
   */
  public getProveedores(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/getProveedores', {headers});
  } 

  /**
   * Abre un blank con el documento seleccionado
   * @param rutaArchivo ruta al archivo del documento
   */
  public abrirArchivo(rutaArchivo: string){
    const url =  (environment.apiUrl + `compras/${rutaArchivo}`);
     window.open(url , '_blank')
  }

  /**
   * Recupera las rutas de los archivos del expediente del proveedor  
   * @param id id del proveedor seleccionado
   * @returns rutas delos archivos del expediente del proveedor
   */
  public getExp(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Proveedores/${id}`, {headers});
  }

  /**
   * Almacena los datos de un nuevo proveedor
   * @param data datos del proveedor (formdata para soporte de archivos)
   * @returns respuesta del servidor "success"
   */
  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/Proveedores', data, {headers});
  }

  /**
   * Actualiza los datos del proveedor del proveedor seleccionado 
   * @param id id del proveedor a editar
   * @param data datos a actualizar (form data)
   * @returns respuesta del servidor con datos actualizados
   */
  public edit(id:number, data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/Proveedores/${id}`, data, {headers});
  }

  /**
   * Borra de la tabla el registro del proveedor
   * @param id id del proveedor a marcar como borrado
   * @returns 
   */
  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/Proveedores/${id}`, {headers});
  }
 /**
  * Envía una petición al servidor para recuperar un zip con el expediente del proveedor
  * @param id id del proveedor
  * @returns archivo zip 
  */
  public descargarExpediente(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/descargar-expediente/${id}`,{ responseType: 'blob' } );
  }
}
