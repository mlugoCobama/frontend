import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private permisos: string[] = [];

  private permisosSubject = new BehaviorSubject<string[]>([]);
  permisos$ = this.permisosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.mapearPermisos();
   }

   /**
   * Obtener permisos actuales
   */
  cargarPermisos(): Observable<string[]> {
    return this.http
      .get<any>(environment.apiUrl+'auth/permissions')
      .pipe(
        map(response => response.permissions || []),
        tap(permisos => {
          this.actualizarPermisos(permisos);
        })
      );
  }

  /**
   * Actualizar permisos y notificar a los componentes.
   */
  private actualizarPermisos(permisos: string[]): void {
    this.permisos = permisos.map((p: any) => p.name);
    this.permisosSubject.next([...this.permisos]);

    localStorage.setItem( 'permisos', JSON.stringify(permisos));
  }


  /**
  * Mapeado Inicial de permisos
  */
  private mapearPermisos(): void {
    const permisosRaw = JSON.parse(localStorage.getItem('permisos') || '[]');
    this.permisos = permisosRaw.map((p: any) => p.name);
  }

  /**
   * Revisa que el usario tenga cargado el permiso
   * @param permiso nombre del permiso
   * @returns ture or false
   */
  tienePermiso(permiso: string): boolean {
    if (!permiso) return true;
    return this.permisos.includes(permiso);
  }

  limpiarPermisos(): void {
    this.permisos = [];
    this.permisosSubject.next([]);
    localStorage.removeItem('permisos');
  }

}
