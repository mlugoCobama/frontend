import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CatProductosService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el listado completo del catálogo de productos.
   * @returns Observable con la lista de productos.
   */
  public getCatalogoProductos(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/CatalogoProductos`);
  }

  /**
   * Guarda o registra un nuevo catálogo de precios en el sistema.
   * @param data Objeto con la información del precio o precios a registrar.
   * @returns Observable con la respuesta del servidor.
   */
  public saveCatalogoPrecios(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/CatalogoPrecios`, data);
  }

  /**
   * Consulta los precios asociados a un proveedor específico.
   * @param id Identificador único del proveedor.
   * @returns Observable con los precios del proveedor.
   */
  public obtenerPreciosProveedor(id:any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/CatalogoPrecios/${id}`);
  }

  /**
   * Realiza una consulta comparativa de precios por lote de proveedores y productos.
   * @param proveedoresIds Lista o arreglo con los IDs de los proveedores.
   * @param productosIds Lista o arreglo con los IDs de los productos.
   * @returns Observable con los datos comparativos de precios.
   */
  public obtenerPreciosLote(proveedoresIds:any, productosIds:any): Observable<any> {
    const data = { proveedores:proveedoresIds, productos: productosIds };
    return this.http.post(environment.apiUrl + `compras/CatalogoPrecios/Comparativa`, data);
  }

  /**
   * Registra o actualiza un producto dentro del catálogo de productos.
   * @param data Objeto con la información del producto.
   * @returns Observable con la confirmación de la operación.
   */
  public saveCatalogoProductos(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/CatalogoProductos`, data);
  }

  /**
   * Elimina un producto del catálogo utilizando su ID.
   * @param id Identificador único del producto a eliminar.
   * @returns Observable con el resultado de la eliminación.
   */
  public borrarProducto(id:any): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/CatalogoProductos/${id}`);
  }


}
