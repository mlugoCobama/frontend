import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';

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

  public obtenerFolio(){
    return this.http.get<{ nuevoFolio: string }>(environment.apiUrl + `compras/generar-folio-co`);
  }

  private selectedFiles: { [key: number]: File } = {};

  setSelectedFile(proveedorId: number, file: File) {
    this.selectedFiles[proveedorId] = file;
  }
  getSelectedFiles() {
    return this.selectedFiles;
  }

  clearFiles() {
    this.selectedFiles = {};
  }

  private formOrdenCompra: FormGroup;

  setForm(form: FormGroup) {
    this.formOrdenCompra = form;
  }

  getForm(): FormGroup {
    return this.formOrdenCompra;
  }
}
