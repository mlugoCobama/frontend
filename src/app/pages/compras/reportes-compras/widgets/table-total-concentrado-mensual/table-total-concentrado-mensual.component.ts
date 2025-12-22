import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FuncionesTablas } from '../../../compras/funciones-tablas';

@Component({
  selector: "app-table-total-concentrado-mensual",
  templateUrl: "./table-total-concentrado-mensual.component.html",
  styleUrl: "./table-total-concentrado-mensual.component.css",
})
export class TableTotalConcentradoMensualComponent implements OnInit{
  @Output() ejecutarConsultaDetalle = new EventEmitter<any>();
  @Output() descargarConcentrado = new EventEmitter<any>()
  @Input() datos = [];
  @Input() params:any;
  @Input() modalAbierto: boolean = false;
  @Input() isDownloadingConcentrado;

  datosFiltrados: any[];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';


  ngOnInit(): void {
    this.ordenador = new FuncionesTablas(this.datos);
    this.datosFiltrados = [...this.datos];
    // console.log(this.datos)
    // this.datosFiltrados = this.datos;
  }

  tiposCompras = ["Compras Generales", "Compras Macro Taller", "Compras Recursos Tecnologicos"]

  get totalGeneral(): number {
    return this.datos.reduce((sum, item) => sum + +item.total_por_empresa, 0);
  }

  get totalSolicitudes(): number {
    return this.datos.reduce((sum, item) => sum + +item.solicitudes, 0);
  }

  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'nombre', 'abreviatura'
    ]);
  }

  public seleccionar1(dato, evento: any) {
      // this.mostrar = true;
      this.ejecutarConsultaDetalle.emit(dato.num_intercompania);
      // console.log(dato)
      if (evento.currentTarget.classList.contains("table-primary")) {
        evento.currentTarget.classList.remove("table-primary");
        // this.mostrar = false;
      } else {
        const filas = document.querySelectorAll("tbody tr");
        filas.forEach((fila) => fila.classList.remove("table-primary"));
        evento.currentTarget.classList.add("table-primary");
      }
    }

selectedItem: any = null;

public seleccionar(dato: any, evento: any) {
  this.ejecutarConsultaDetalle.emit({intercompania :dato.num_intercompania, empresa: dato.empresa});
  if (this.selectedItem === dato) {
    this.selectedItem = null;
  } else {
    this.selectedItem = dato;
  }
}

public btnDescargarConcentrado(){
  this.descargarConcentrado.emit();
}





}
