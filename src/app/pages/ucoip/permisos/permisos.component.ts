import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/core/services/ucoip/permisos.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {
  correo: string = '';
  permisos: any[] = [];
  idUsuario: number | null = null;
  usuarioConsultado: string = '';
  loading: boolean = false;

  activeTab: number = 0;


  constructor(private permisosService: PermisosService) {}

  buscarPermisos() {
    this.loading = true;
    this.permisosService.buscarPermisos(this.correo).subscribe({
      next: (response) => {
        this.permisos = response.data.permisos;
        this.usuarioConsultado = response.data.usuario
        this.idUsuario = response.data.intranet !== 'No filtrado' && response.data.intranet !== 'No encontrado'
          ? response.data.intranet
          : null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los permisos'
        });
      }
    });
  }

  guardarPermisos() {
    const seleccionados = this.permisos.flatMap(modulo =>
      modulo.permisos.filter((p: any) => p.activo).map((p: any) => p.id)
    );

    this.loading = true;
    this.permisosService.guardarPermisos(this.idUsuario!, seleccionados).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: res.message || 'Permisos actualizados correctamente'
        });
        this.buscarPermisos();
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron actualizar los permisos'
        });
      }
    });
  }


  trackByPermiso(index: number, permiso: any): number {
  return permiso.id;
}


}

