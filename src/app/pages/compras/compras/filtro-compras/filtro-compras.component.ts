import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface FiltrosCompras {
  empresa: number | null;
  proveedor: number | null;
  anio: number | null;
  mes: number | null;
}

@Component({
  selector: 'app-filtro-compras',
  templateUrl: './filtro-compras.component.html',
  styleUrl: './filtro-compras.component.css'
})
export class FiltroComprasComponent implements OnInit {


  @Input() empresas: any[] = [];

  proveedores:any[] = [];

  @Input() data: any[] = [];

  @Output() filtrosChange = new EventEmitter<FiltrosCompras>();

  filtros: FiltrosCompras = {
    empresa: null,
    proveedor:null,
    anio: null,
    mes: null,
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

  ngOnInit(): void {
    this.proveedores = [...new Set(this.data.filter((x:any) => x.proveedor != '-').map((x:any) => x.proveedor))].sort();
  }


  private generarAnios() {
    const anios = this.data
      .map(item => this.obtenerAnio(item.fecha))
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

    // console.log(this.filtros)
    this.filtrosChange.emit({...this.filtros});
  }


  limpiarFiltros() {

    this.filtros = {
      empresa: null,
      proveedor:null,
      anio: null,
      mes: null,
    };

    this.seleccionarFiltro();

  }

}
