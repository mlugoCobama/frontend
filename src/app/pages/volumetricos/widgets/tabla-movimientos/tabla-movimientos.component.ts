import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { PipeTransform } from '@angular/core';
import { Type } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

type PipeTipo = 'number' | 'date' | 'currency' | 'none';
interface TableColumn<T> {
  key: keyof T;
  label: string;
  class?: string;
  template?: (item: T) => string;
  pipe?: PipeTipo;
  pipeArgs?: string; 
}

@Component({
  selector: 'app-tabla-movimientos',
  templateUrl: './tabla-movimientos.component.html',
  styleUrl: './tabla-movimientos.component.css'
})

export class TablaMovimientosComponent<T> implements OnInit, OnChanges {

  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() searchFields: (keyof T)[] = [];
  @Input() placeholder = 'Buscar...';

  datosFiltrados: T[] = [];

  tabla!: FuncionesTablas<T>;

constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.inicializar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['data']){
      this.inicializar();
    }
  }

  inicializar() {
    this.tabla = new FuncionesTablas([...this.data]);
    this.datosFiltrados = [...this.data];
  }

  ordenar(columna: keyof T) {
    this.datosFiltrados = this.tabla.ordenar(columna);
  }

  buscar(event: Event) {
    const valor = (event.target as HTMLInputElement).value;

    if(!valor){
      this.datosFiltrados = this.tabla.reset();
      return;
    }

    this.datosFiltrados = this.tabla.filtrar(
      valor,
      this.searchFields
    );
  }

   obtenerValor(item: T, column: TableColumn<T>) {
     if(column.template){
       return column.template(item);
     }
     return item[column.key];
   }

  // obtenerValor(item: T, column: TableColumn<T>): string | null {
  //   // Si hay template, tiene prioridad total
  //   if (column.template) {
  //     return column.template(item);
  //   }

  //   const valor = item[column.key];

  //   // Sin pipe o valor nulo/undefined → retorna tal cual
  //   if (!column.pipe || column.pipe === 'none' || valor == null) {
  //     return String(valor ?? '');
  //   }

  //   switch (column.pipe) {
  //     case 'number':
  //       return this.decimalPipe.transform(valor as number, column.pipeArgs ?? '1.0-2') ?? '';

  //     case 'currency':
  //       return this.currencyPipe.transform(
  //         valor as number,
  //         column.pipeArgs ?? 'MXN', // moneda
  //         'symbol',                  // display
  //         '1.2-2',                   // formato
  //         'es-MX'                    // locale
  //       ) ?? '';

  //     case 'date': {
  //       const fecha = new Date(valor as string);
  //       // Solo transforma si la fecha es válida
  //       if (isNaN(fecha.getTime())) return String(valor);
  //       return this.datePipe.transform(fecha, column.pipeArgs ?? 'dd/MM/yyyy HH:mm:ss', undefined, 'es-MX') ?? '';
  //     }

  //     default:
  //       return String(valor);
  //   }
  // }

  

}
