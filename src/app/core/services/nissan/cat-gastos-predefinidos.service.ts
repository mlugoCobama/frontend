import { HttpClient, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatGastosPredefinidosService {

  constructor(private http: HttpClient) { }

    /** Recupera todos los registros de gasto predefinidos */
    public getAll(){
      return this.http.get<any>(environment.apiUrl + `nissan/gasto-predefinido`);
    }

    /** Almacena un registro de un gasto predefinido*/
    public store(data:any){
      return this.http.post<any>(environment.apiUrl + `nissan/gasto-predefinido`, data);
    }

    /** Actualiza un registro de un gasto predefinido*/
    public update(id:any, data:any){
      return this.http.put<any>(environment.apiUrl + `nissan/gasto-predefinido/${id}`, data);
    }

    /** Borra un registro de un gasto predefinido*/
    public delete(id:any){
      return this.http.delete<any>(environment.apiUrl + `nissan/gasto-predefinido/${id}`);
    }
}
