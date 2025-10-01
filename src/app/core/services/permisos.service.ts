import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private permisos: string[] = [];


  constructor() {
    this.mapearPermisos();
   }
   private mapearPermisos(): void {
    const permisosRaw = JSON.parse(localStorage.getItem('permisos') || '[]');
    this.permisos = permisosRaw.map((p: any) => p.name);
  }

  tienePermiso(permiso: string): boolean {
    if (!permiso) return true;
    return this.permisos.includes(permiso);
  }

}
