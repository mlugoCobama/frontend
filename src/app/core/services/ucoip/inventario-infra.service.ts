import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inventario, ResponseInvetario } from '../../models/ucoip/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioInfraService {

  private dataSubject = new BehaviorSubject<any[]>([]);
  data$ = this.dataSubject.asObservable();

    constructor(private http: HttpClient) { }
    /**
     * Funcion para obtener todos los registros de inventarios
     */
    public getAll(): Observable<ResponseInvetario> {
      return this.http.get<ResponseInvetario>(environment.apiUrl + 'ucoip/hardware-infra');
    }
    /**
     * Funcion para crear un nuevo registro
     */
    public save(data: Inventario): Observable<ResponseInvetario> {
      return this.http.post<ResponseInvetario>(environment.apiUrl + 'ucoip/hardware-infra', data);
    }

    public update(data: Inventario, id:number): Observable<ResponseInvetario> {
      return this.http.put<ResponseInvetario>(environment.apiUrl + 'ucoip/hardware-infra/'+id, data);
    }

    loadData() {
      this.http.get<ResponseInvetario>(environment.apiUrl + 'ucoip/hardware-infra').subscribe((data) => {

        this.dataSubject.next(data.data);
      });
    }

    addData(newRecord: any) {
      return this.http.post('/api/data', newRecord).pipe(
        tap(() => this.loadData()) // Refrescar datos después de agregar
      );
    }


    public destroy(id: any): Observable<any> {
      return this.http.delete(environment.apiUrl +'ucoip/hardware/'+id);
    }


    public getCatMantenimientos(): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'ucoip/catalogos/mantenimiento');
    }
}
