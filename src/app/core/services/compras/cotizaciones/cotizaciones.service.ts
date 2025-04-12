import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class CotizacionesService {
  constructor(private http: HttpClient) {}
  private selectedFiles: { [key: number]: File } = {}; //array donde se guardan los archivos cargados
  private formOrdenCompra: FormGroup; //FormGroup donde se guardan los datos del input

  public getOne(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Cotizaciones/${id}`);
  }

  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "compras/Cotizaciones", data);
  }

  /**
   * Recupera los archivos de cotizaciones en el servidor
   * @param rutaArchivo Archivo en le servidor
   */
  public abrirArchivo(rutaArchivo: string) {
    const url = environment.apiUrl + `compras/${rutaArchivo}`;
    window.open(url, "_blank");
  }


  //Recupera los archivos del componente dentro del servicio
  setSelectedFile(proveedorId: number, file: File) {
    this.selectedFiles[proveedorId] = file;
  }


  //Envia los archivos del componente dentro del servicio
  getSelectedFiles() {
    return this.selectedFiles;
  }


  //Limpia el arreglo donde se almacenan los archivos
  clearFiles() {
    this.selectedFiles = {};
  }


  //Recupera el valor donde se guardan los datos del input
  setForm(form: FormGroup) {
    this.formOrdenCompra = form;
  }

  
  //Recupera el valor donde se guardan los datos del input
  getForm(): FormGroup {
    return this.formOrdenCompra;
  }
}
