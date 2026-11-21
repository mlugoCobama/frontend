import { Component } from '@angular/core';
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
  filtroPermiso: string = '';

  constructor(private permisosService: PermisosService) {}

  buscarPermisos() {
    if (!this.correo.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo requerido',
        text: 'Ingresa un correo electrónico para buscar los permisos.'
      });
      return;
    }

    this.loading = true;
    this.filtroPermiso = '';

    this.permisosService.buscarPermisos(this.correo.trim()).subscribe({
      next: (response) => {
        this.permisos = response.data.permisos ?? [];
        this.usuarioConsultado = response.data.usuario ?? '';
        this.activeTab = 0;
        this.idUsuario =
          response.data.intranet !== 'No filtrado' && response.data.intranet !== 'No encontrado'
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

  seleccionarTab(index: number) {
    this.activeTab = index;
    this.filtroPermiso = '';
  }

  limpiarFiltro() {
    this.filtroPermiso = '';
  }

  permisosFiltrados(modulo: any): any[] {
    const lista = modulo?.permisos ?? [];
    const termino = this.normalizarTexto(this.filtroPermiso);

    if (!termino) {
      return lista;
    }

    return lista.filter((permiso: any) => {
      const descripcion = this.normalizarTexto(permiso.descripcion);
      const nombre = this.normalizarTexto(permiso.nombre);
      return descripcion.includes(termino) || nombre.includes(termino);
    });
  }

  guardarPermisos() {
    const seleccionados = this.permisos.flatMap(modulo =>
      (modulo.permisos ?? []).filter((p: any) => p.activo).map((p: any) => p.id)
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
    return permiso.id ?? index;
  }

  private normalizarTexto(valor: unknown): string {
    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
