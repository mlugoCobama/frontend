import { Component, Input, OnInit } from '@angular/core';
import { AuditoriaUcoipService } from 'src/app/core/services/ucoip/auditoria-ucoip.service';

export interface AuditoriaDetalle {
  id: number;
  tipo: 'hardware' | 'sistema' | 'recurso_red' | 'licenciamiento';
  referencia_id: number | null;
  resultado: string;
  datos: any;
  observaciones: string | null;
}

export interface Auditoria {
  id: number;
  ucoip_ucoip_id: number;
  responsable_id: number;
  fecha: string;
  estatus: string;
  observaciones: string | null;
  responsable?: {
    id: number;
    name: string;
    realname:string;
    firstname:string;
  };
  detalles?: AuditoriaDetalle[];
}

@Component({
  selector: 'app-card-auditoria',
  templateUrl: './card-auditoria.component.html',
  styleUrl: './card-auditoria.component.css'
})

export class CardAuditoriaComponent implements OnInit {

  @Input() ucoip: any;
  public allUcoip:any;

  auditorias: Auditoria[] = [];
  public mostrarFormulario:boolean = false;

  auditoriaSeleccionada: Auditoria | null = null;

  cargando = false;

  constructor(
    private auditoriasService: AuditoriaUcoipService
  ) {}

  ngOnInit(): void {
    if (this.ucoip?.id) {
      this.cargarAuditorias();
      this.getAllUcoip()
    }
  }

  cargarAuditorias(): void {

    this.cargando = true;

    this.auditoriasService
      .getAuditoriasUcoip(this.ucoip.id)
      .subscribe({
        next: (response) => {
          this.auditorias = response.data;
          console.log(response)
          this.cargando = false;
        },
        error: (error) => {
          console.error(error);
          this.cargando = false;
        }
      });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  verAuditoria(auditoria: Auditoria): void {

    // this.auditoriasService
    //   .getAuditoria(auditoria.id)
    //   .subscribe({
    //     next: (response) => {
    //       this.auditoriaSeleccionada = response.data;
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     }
    //   });
  }

  cerrarDetalle(): void {
    this.auditoriaSeleccionada = null;
  }

  descargarPdf(auditoria: Auditoria): void {

      this.auditoriasService
        .printAuditoriaPDF(auditoria.id)
        .subscribe({
          next: (response) => {

            const blob = response.body;

            if (!blob) {
              return;
            }

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');

            link.href = url;
            link.download = `auditoria_${this.ucoip.ucoip}.pdf`;

            link.click();

            window.URL.revokeObjectURL(url);
          },

          error: (error) => {
            console.error('Error al descargar el PDF', error);
          }
        });
    }

  getResultadoClass(resultado: string): string {

    switch (resultado) {

      case 'correcto':
        return 'badge bg-success';

      case 'diferencia':
        return 'badge bg-warning text-dark';

      case 'no_localizado':
        return 'badge bg-danger';

      case 'no_asignado':
        return 'badge bg-info text-dark';

      case 'no_aplica':
        return 'badge bg-secondary';

      default:
        return 'badge bg-secondary';
    }
  }

  getResultadoTexto(resultado: string): string {

    switch (resultado) {

      case 'correcto':
        return 'Correcto';

      case 'diferencia':
        return 'Diferencia';

      case 'no_localizado':
        return 'No localizado';

      case 'no_asignado':
        return 'No asignado';

      case 'no_aplica':
        return 'No aplica';

      default:
        return resultado;
    }
  }
  public getAllUcoip(){
    this.auditoriasService.getAuditUcoip(this.ucoip.id).subscribe({
      next: async (resp) => {
        if (resp.status == "success") {
          this.allUcoip = resp.data;
        }
      },
      error: (err) => {
        console.error('Error cargando módulos', err);
      }
    });
  }

  public guardadoExitoso(){
    this.cargarAuditorias();
    this.mostrarFormulario = false;
  }
}
