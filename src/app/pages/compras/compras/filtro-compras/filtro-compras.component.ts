import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PermisosService } from 'src/app/core/services/permisos.service';

export interface FiltrosCompras {
  intercompania: any | null;
  empresa: any | null;
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
  @Input() empresaSeleccionada = '';
  @Input() intercompaniaSeleccionada:any = null;

  @Input() viewOptionAll = false;
  @Input() viewSelectEmpresas = false;
  @Input() viewSelectProveedores = false;

  proveedores:any[] = [];

  @Input() data: any[] = [];

  @Output() filtrosChange = new EventEmitter<FiltrosCompras>();
  @Output() reload = new EventEmitter<FiltrosCompras>();


  @Input() empresaActual:any = '';
  @Input() anioActual:any;
  @Input() mesActual:any;


  filtros: FiltrosCompras = {
    intercompania:null,
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

      private permisosService = inject(PermisosService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.proveedores = [...new Set(this.data.filter((x:any) => x.proveedor != '-').map((x:any) => x.proveedor))].sort();
    }

    if(changes['empresaSeleccionada'] && this.empresaSeleccionada){
      this.filtros.empresa = this.empresaSeleccionada;
    }
  }

  ngOnInit(): void {
    this.generarAnios();
    this.filtros = {
      intercompania: this.intercompaniaSeleccionada,
      empresa: this.empresaSeleccionada,
      proveedor:null,
      anio: this.anioActual,
      mes: this.mesActual,
    };
  }


  private generarAnios() {

    const anioActual: number = new Date().getFullYear();
    const anioInicio: number = 2025


    const anios: number[] = [];
    for (let i = anioInicio; i <= anioActual; i++) {
        anios.push(i);
    }

    this.anios = [...new Set(anios)].sort((a, b) => b - a);
  }

  seleccionarFiltro() {
    this.filtrosChange.emit({...this.filtros});
  }

  recargar(){
    this.reload.emit({...this.filtros});
  }


  limpiarFiltros() {
    this.filtros = {
      intercompania:null,
      empresa: null,
      proveedor:null,
      anio: null,
      mes: null,
    };
    this.seleccionarFiltro();
  }

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

}
