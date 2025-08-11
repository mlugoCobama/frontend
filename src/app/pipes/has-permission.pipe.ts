import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasPermission',
  standalone: false
})
export class HasPermissionPipe implements PipeTransform {

  transform(permiso: string): unknown {
    
    if (!permiso) return true;

    const permisosRaw = localStorage.getItem('permisos');
    if (!permisosRaw) return false;

    try {
      const permisos = JSON.parse(permisosRaw);
      const lista = permisos.map((p: any) => p.name);
      //return lista.includes(permiso);
      return true;
    } catch (error) {
      console.error('Error al parsear permisos del localStorage', error);
      return false;
    }
    
  }

}
