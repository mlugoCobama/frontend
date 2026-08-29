import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FiltrosReportesVolumetricos {
  empresa: number | null;
  anio: number | null;
  mes: number | null;
  tipoInstalacion: string | null;
}

@Component({
  selector: 'app-filtro-reportes-volumetrico',
  templateUrl: './filtro-reportes-volumetrico.component.html',
  styleUrl: './filtro-reportes-volumetrico.component.css'
})
export class FiltroReportesVolumetricoComponent {

  @Input() empresas: any[] = [];

  @Input() reportes: any[] = [];

  @Output() filtrosChange = new EventEmitter<FiltrosReportesVolumetricos>();

  filtros: FiltrosReportesVolumetricos = {
    empresa: null,
    anio: null,
    mes: null,
    tipoInstalacion: null
  };

  anios: number[] = [];

  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
  ];

  tiposInstalacion = [
    {
      valor: 'PDD',
      nombre: 'Distribución'
    },

    {
      valor: 'EXO',
      nombre: 'Expendio'
    },
    {
      valor: 'CMN',
      nombre: 'Comercialización'
    },
    {
      valor: 'TDA',
      nombre: 'Almacenamiento'
    },
  ];


  ngOnChanges() {

    this.generarAnios();

  }


  private generarAnios() {

    const anios = this.reportes
      .map(reporte => this.obtenerAnio(reporte.fecha_reporte_txt))
      .filter((anio): anio is number => anio !== null);

    this.anios = [...new Set(anios)].sort((a, b) => b - a);
  }


  private obtenerAnio(periodo: string): number | null {
    if (!periodo) {
      return null;
    }

    const match = String(periodo).match(/\d{4}/);
    return match ? Number(match[0]) : null;
  }


  seleccionarFiltro() {
    this.filtrosChange.emit({...this.filtros});
  }


  limpiarFiltros() {

    this.filtros = {
      empresa: null,
      anio: null,
      mes: null,
      tipoInstalacion: null
    };

    this.seleccionarFiltro();

  }

}
