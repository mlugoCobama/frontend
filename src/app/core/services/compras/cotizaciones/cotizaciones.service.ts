import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormGroup } from "@angular/forms";

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

@Injectable({
  providedIn: "root",
})
export class CotizacionesService {
  constructor(private http: HttpClient) {}
  private selectedFiles: { [key: number]: File } = {}; //array donde se guardan los archivos cargados
  private formOrdenCompra: FormGroup; //FormGroup donde se guardan los datos del input

  /**
   * Recupera la relación entre cotización y proveedores
   * @param id id de cotización
   * @returns registros cotización-proveedor
   */
  public getOne(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Cotizaciones/${id}`, {headers});
  }

  /**
   * Recupera la relación entre cotización y proveedores
   * @param id id de cotización
   * @returns registros cotización-proveedor
   */
  public solicitarAutorizacion(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/solicitar-autorizacion/${id}`, {headers});
  }

  /**
   * Guarda los datos y archivos de cotizaciones
   * @param data precios y archivos ligados a la cotización (formData)
   * @returns
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/Cotizaciones", data, {headers});
  }

  /**
   * Recupera los archivos de cotizaciones en el servidor
   * @param rutaArchivo Archivo en le servidor
   */
  public abrirArchivo(rutaArchivo: string) {
    const url = environment.apiUrl + `compras/${rutaArchivo}`;
    window.open(url, "_blank");
  }

  /**
   * Recupera los archivos del componente dentro del servicio
   * @param proveedorId id del proveedor con el que se cotiza
   * @param file archivo ligado a la cotizacion
   */
  setSelectedFile(proveedorId: number, file: File) {
    this.selectedFiles[proveedorId] = file;
  }

  /**
   * Recupera archivos almacenados en selectedFiles
   * @returns this.selectedFiles = {files...};
   */
  getSelectedFiles() {
    return this.selectedFiles;
  }

  /**
   * Limpia los archivos almacenados en selectedFiles
   * @returns this.selectedFiles = {};
   */
  clearFiles() {
    this.selectedFiles = {};
  }

  /**
   * Envía los valores al formGroup que esta en el service
   * @returns
   */
  setForm(form: FormGroup) {
    this.formOrdenCompra = form;
  }

  /**
   * Recupera el valor donde se guardan los datos del formOrdenCompra
   * @returns
   */
  getForm(): FormGroup {
    return this.formOrdenCompra;
  }
}
