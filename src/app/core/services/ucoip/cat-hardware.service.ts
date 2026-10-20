import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ResponseCatHardware } from '../../models/ucoip/cat-hardware';

@Injectable({
  providedIn: 'root'
})
export class CatHardwareService {

  constructor(private http: HttpClient) { }
    /**
     * Funcion para obtener todos los registros de inventarios
     */
    public getAll(): Observable<ResponseCatHardware> {
      return this.http.get<ResponseCatHardware>(environment.apiUrl + 'ucoip/cat-hardware');
    }

    public getCatInfra(): Observable<ResponseCatHardware> {
      return this.http.get<ResponseCatHardware>(environment.apiUrl + 'ucoip/cat/hardware/infra');
    }


    public getHardwareDisponible(idEmpresa:number): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'ucoip/hardware/catalogo/disponible/'+idEmpresa);
    }


}
